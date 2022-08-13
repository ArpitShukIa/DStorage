import {useEffect, useState} from "react";
import {useEthers} from "@usedapp/core";
import {providers} from "ethers";
import {getAllFiles, getDeployedContract} from "../util/contractUtils";
import {CircularProgress} from "@mui/material";
import UploadForm from "./UploadForm";
import {ipfsClient} from "../util/ipfs";
import FilesTable from "./FilesTable";

function App() {

    const [contract, setContract] = useState(null)
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(false)

    const {account, activateBrowserWallet, deactivate, chainId} = useEthers()

    const isConnected = account !== undefined

    useEffect(() => {
        const provider = new providers.Web3Provider(window.ethereum, "any")
        provider.on("network", (newNetwork, oldNetwork) => {
            // When a Provider makes its initial connection, it emits a "network"
            // event with a null oldNetwork along with the newNetwork. So, if the
            // oldNetwork exists, it represents a changing network
            if (oldNetwork) {
                window.location.reload()
            }
        })
    }, [])

    useEffect(() => {
        if (!account || contract)
            return
        const run = async () => {
            setLoading(true)
            const contract = await getDeployedContract()
            if (contract) {
                setContract(contract)
                refresh(contract)
            } else {
                window.alert('Please connect to Rinkeby Test Network')
            }
        }
        run()
    }, [account, chainId])

    const refresh = async (contract) => {
        setLoading(true)
        try {
            const files = await getAllFiles(contract)
            console.log(files)
            setFiles(files)
        } catch (e) {
            console.error(e)
        }
        setLoading(false)
    }

    const uploadFile = async (file, fileDescription) => {
        const fileName = file.name
        const fileType = file.type
        setLoading(true)
        try {
            const result = await ipfsClient.add(file)
            const tx = await contract.uploadFile(result.path, result.size, fileType, fileName, fileDescription)
            await tx.wait(1)
            await refresh(contract)
        } catch (e) {
            console.log(e)
        }
        setLoading(false)
    }

    return (
        <div>
            <div style={{width: "60%", marginLeft: "20%"}}>
                {
                    loading
                        ?
                        <div style={{height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <CircularProgress size={80}/>
                        </div>
                        : <div>
                            {
                                isConnected ?
                                    <button className="btn btn-secondary"
                                            style={{position: "absolute", right: 30}}
                                            onClick={deactivate}
                                    >
                                        Disconnect
                                    </button>
                                    : ""
                            }
                            <h2 className="mt-3" style={{textAlign: "center"}}>DStorage</h2>
                            <hr/>
                            <br/>
                            {
                                isConnected
                                    ? <div>
                                        <div style={{width: "60%", marginLeft: "20%"}}>
                                            <UploadForm uploadFile={uploadFile}/>
                                        </div>
                                        <br/><br/><br/>
                                        <FilesTable files={files}/>
                                    </div>
                                    : <div style={{textAlign: "center"}}>
                                        <p style={{fontSize: 20}}>Connect to your Metamask wallet</p>
                                        <button className="btn btn-primary" onClick={activateBrowserWallet}>Connect</button>
                                    </div>
                            }
                        </div>
                }
            </div>
        </div>
    );
}

export default App;

import DStorage from "../chain-info/contracts/DStorage.json"
import networkMapping from "../chain-info/deployments/map.json"
import {Contract, providers, utils} from "ethers";

export const getDeployedContract = async () => {
    const {abi} = DStorage
    const provider = new providers.Web3Provider(window.ethereum)
    const {chainId} = await provider.getNetwork()
    if (!chainId || !networkMapping[String(chainId)]) {
        return null
    }
    const contractAddress = networkMapping[String(chainId)]["DStorage"][0]
    const contractInterface = new utils.Interface(abi)
    const contract = new Contract(contractAddress, contractInterface, provider.getSigner())
    return await contract.deployed()
}

export const getAllFiles = async (contract) => {
    const files = []
    const fileCount = await contract.fileCount()
    // Load files starting from the newest
    for (let i = fileCount; i > 0; i--) {
        const file = await contract.files(i)
        files.push({
            name: file.fileName,
            type: file.fileType,
            size: file.fileSize.toNumber(),
            description: file.fileDescription,
            hash: file.fileHash,
            uploadTime: file.uploadTime.toNumber(),
            uploader: file.uploader
        })
    }
    return files
}

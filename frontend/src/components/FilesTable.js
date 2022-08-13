import React from 'react';
import {convertBytes} from "../util/helpers";
import moment from 'moment'
import {getIpfsUrl} from "../util/ipfs";

function FilesTable({files}) {
    return (
        <table className="table table-bordered text-center">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Type</th>
                <th scope="col">Size</th>
                <th scope="col">Upload Date</th>
                <th scope="col">Uploader</th>
                <th scope="col">Hash</th>
            </tr>
            </thead>
            <tbody style={{fontSize: 14}}>
            {
                files.map((file, index) =>
                    <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{file.name}</td>
                        <td>{file.description}</td>
                        <td>{file.type}</td>
                        <td>{convertBytes(file.size)}</td>
                        <td>{moment.unix(file.uploadTime).format("DD-MM-YYYY HH:mm:ss")}</td>
                        <td>
                            <a
                                href={"https://rinkeby.etherscan.io/address/" + file.uploader}
                                rel="noopener noreferrer"
                                target="_blank"
                                style={{textDecoration: "none"}}>
                                {file.uploader.substring(0, 10)}...
                            </a>
                        </td>
                        <td>
                            <a
                                href={getIpfsUrl(file.hash)}
                                rel="noopener noreferrer"
                                target="_blank"
                                style={{textDecoration: "none"}}>
                                {file.hash.substring(0, 10)}...
                            </a>
                        </td>
                    </tr>
                )
            }
            </tbody>
        </table>
    );
}

export default FilesTable;
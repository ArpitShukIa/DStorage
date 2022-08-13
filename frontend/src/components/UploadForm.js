import React, {useRef, useState} from 'react';

function UploadForm({uploadFile}) {

    const [fileDescription, setFileDescription] = useState("")
    const [file, setFile] = useState(null)
    const fileRef = useRef()

    const onSubmit = (e) => {
        e.preventDefault()
        uploadFile(file, fileDescription)
    }

    return (
        <div className="card">
            <span className="card-header text-center">
                Share File
            </span>
            <div className="card-body">
                <form onSubmit={onSubmit}>
                    <input className="form-control"
                           placeholder="Enter file description"
                           value={fileDescription}
                           onChange={e => setFileDescription(e.target.value)}
                           required
                    />
                    <input type="file"
                           className="form-control mt-3"
                           ref={fileRef}
                           required
                           onChange={e => setFile(e.target.files[0])}
                    />
                    <button className="btn btn-primary w-100 mt-3" type="submit">Upload</button>
                </form>
            </div>
        </div>
    );
}

export default UploadForm;

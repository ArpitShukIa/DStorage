import pytest
from brownie import exceptions

from scripts.deploy import deploy
from scripts.helpful_scripts import get_account


def test_file_upload():
    account = get_account()
    dstorage = deploy()

    # Test values
    file_hash = '8743b52063cd84097a65d1633f5c74f5'
    file_size = 100
    file_type = 'txt'
    file_name = 'test_file'
    file_description = 'test_description'

    # Empty file hash
    with pytest.raises(exceptions.VirtualMachineError):
        dstorage.uploadFile('', file_size, file_type, file_name, file_description)

    # Zero file size
    with pytest.raises(exceptions.VirtualMachineError):
        dstorage.uploadFile(file_hash, 0, file_type, file_name, file_description)

    # Empty file type
    with pytest.raises(exceptions.VirtualMachineError):
        dstorage.uploadFile(file_hash, file_size, '', file_name, file_description)

    # Empty file name
    with pytest.raises(exceptions.VirtualMachineError):
        dstorage.uploadFile(file_hash, file_size, file_type, '', file_description)

    # Empty file description
    with pytest.raises(exceptions.VirtualMachineError):
        dstorage.uploadFile(file_hash, file_size, file_type, file_name, '')

    tx = dstorage.uploadFile(file_hash, file_size, file_type, file_name, file_description)

    assert dstorage.fileCount() == 1

    file = dstorage.files(1)
    assert file[0] == 1
    assert file[1] == file_hash
    assert file[2] == file_size
    assert file[3] == file_type
    assert file[4] == file_name
    assert file[5] == file_description
    assert file[7] == account

    assert tx.events['FileUploaded']['fileId'] == 1
    assert tx.events['FileUploaded']['fileHash'] == file_hash
    assert tx.events['FileUploaded']['fileSize'] == file_size
    assert tx.events['FileUploaded']['fileType'] == file_type
    assert tx.events['FileUploaded']['fileName'] == file_name
    assert tx.events['FileUploaded']['fileDescription'] == file_description
    assert tx.events['FileUploaded']['uploader'] == account

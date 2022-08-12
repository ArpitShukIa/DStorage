import os
import shutil

from brownie import network, config, DStorage

from scripts.helpful_scripts import get_account


def deploy(update_frontend=False):
    account = get_account()
    dstorage = DStorage.deploy(
        {'from': account},
        publish_source=config["networks"][network.show_active()].get("verify", False)
    )
    if update_frontend:
        update_front_end()
    return dstorage


def update_front_end():
    # Send the build folder
    src = "./build"
    dest = "./frontend/src/chain-info"
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)
    print("Front end updated!")


def main():
    deploy(update_frontend=False)

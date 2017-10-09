# ADDTech

This repository contains a Fabric Chaincode based codebase for [ADDTech]

## Getting Started

The code in this repository has been tested in the following environment:

- Node: `v8.9.3` and `v8.11.4`
- Hyperledger fabric: `v1.2`
- Docker: `18.06.1-ce`
- Python: `2.7.12`
- Go: `go1.9.3 linux/amd64`
- Curl: `7.47.0`

I would recommend using the same version, while adapting/using this code.

Please visit the [installation instructions](http://hyperledger-fabric.readthedocs.io/en/latest/install.html)
to ensure you have the correct prerequisites installed. Please use the
version of the documentation that matches the version of the software you
intend to use to ensure alignment.

After making sure the [prerequisites](https://hyperledger-fabric.readthedocs.io/en/release-1.2/prereqs.html) and [binaries](https://hyperledger-fabric.readthedocs.io/en/release-1.2/install.html#) are installed properly, follow the following steps:

```sh
cd path/to/repository/folder
cd network
```

Once you are in the network folder you can start setting up ADDTech network environment.

## Housekeeping and Bringing the Network Down

If it's your second time running this test task, or you have run any other HyperLedger Fabric based code, first run the following commands:

```sh
./addtech_network.sh down
```

It will ask for a confirmation:

```sh
Stopping for channel 'addtechchannel' with CLI timeout of '10' seconds and CLI delay of '3' seconds
Continue? [Y/n]
```

Press `Y` and continue.

You can also use the above commands to bring down the network, everytime before restarting it.

> Note: You can always check how many containers, volumes and networks of docker are up and running, using the following commands:

- `docker ps`
- `docker volume ls`
- `docker network ls`

If you have problems in shutting down containers and volumes using the script, try running the following commands:

- `docker network prune`
- `docker volume prune`
- `docker rm -f $(docker ps -aq)`
- `docker system prune`

## Network Setup

Once you're done with the Housekeeping, you are ready to start your network, use the following commands:

```sh
./addtech_network.sh up
Starting for channel 'addtechchannel' with CLI timeout of '10' seconds and CLI delay of '3' seconds
Continue? [Y/n] Y
...
```

It may take some time to execute (usually between 60- 120 seconds, to execute). But if you see the following log in your terminal it executed successfully, and your network is ready to use.

```sh
========= All GOOD, execution completed ===========
 _____   _   _   ____
| ____| | \ | | |  _ \
|  _|   |  \| | | | | |
| |___  | |\  | | |_| |
|_____| |_| \_| |____/

```

It created the required certificates for each entity of HyperLedger using the `crypto-config.yaml` file, in a folder named `crypto-config` within your networks directory. Check it out!

It also created `channel.tx`, `genesis.block`.

## Calling getter functions within the chaincode

When you start the network, you automatically bring up the 2 Orgs:

- orgone.addtech.com
- orgtwo.addtech.com
  You also create a public channel between them and instantiate Donation Manager Chaincode on that channel. Now, we can call getter functions using the CLI. To enter the CLI, use the following command:

```sh
docker exec -it cli bash
```

Here you can fire following getter commands:

### readDonation

Can be used to read the data stored for any Donation ID.

```sh
peer chaincode query -C addtechchannel -n donation-manager-chaincode -c '{"Args":["readDonation","929cd618f0c6598eddaff18fa8ffab809ce1f35cb31a3270aa1fc80f1f92b85b"]}'

// Expected Output format if ID not created:
{"key":"929cd618f0c6598eddaff18fa8ffab809ce1f35cb31a3270aa1fc80f1f92b85b","value":null}

// Expected Output format if ID created:
{"key":"929cd618f0c6598eddaff18fa8ffab809ce1f35cb31a3270aa1fc80f1f92b85b","value":{"project":"ITU","itemType":"toys","amount":1,"timestamp":{"seconds":{"low":1551102037,"high":0,"unsigned":false},"nanos":512532845},"validity":true}}
```

### readMultipleDonations

Can be used to read the data for multiple donation IDs.

```sh
peer chaincode query -C addtechchannel -n donation-manager-chaincode -c '{"Args":["readMultipleDonations","929cd618f0c6598eddaff18fa8ffab809ce1f35cb31a3270aa1fc80f1f92b85b", "c47eb9d83aae530a25831603184084050d2fee33383f597454e8d0cc517ed1f1", "7d0a59f560e88b7f8e1019353bb38786b8f981e6a62b9cc54204314591f4380r"]}'

// Expected Output Format:
{"929cd618f0c6598eddaff18fa8ffab809ce1f35cb31a3270aa1fc80f1f92b85b":{"value":null},"c47eb9d83aae530a25831603184084050d2fee33383f597454e8d0cc517ed1f1":{"value":{"project":"ITU","itemType":"toys","amount":"1","timestamp":{"seconds":{"low":1551265041,"high":0,"unsigned":false},"nanos":151019250},"validity":true}},"7d0a59f560e88b7f8e1019353bb38786b8f981e6a62b9cc54204314591f4380r":{"value":null}}
```

### isPresent

Can be used to check if a Donation ID is present or not.

```sh
peer chaincode query -C addtechchannel -n donation-manager-chaincode -c '{"Args":["isPresent","929cd618f0c6598eddaff18fa8ffab809ce1f35cb31a3270aa1fc80f1f92b85b"]}'

// Expected Output if present:
{"exists":true}

// Expected Output if absent:
{"exists":false}
```

### getHistoryForDonation

Gets the create/update/delete history for a particular donation ID.

```sh
peer chaincode query -C addtechchannel -n donation-manager-chaincode -c '{"Args":["getHistoryForDonation","929cd618f0c6598eddaff18fa8ffab809ce1f35cb31a3270aa1fc80f1f92b85b"]}'

// Expected Output:
[{"TxId":"929cd618f0c6598eddaff18fa8ffab809ce1f35cb31a3270aa1fc80f1f92b85b","Timestamp":{"seconds":{"low":1551102037,"high":0,"unsigned":false},"nanos":512532845},"IsDelete":"false","Value":{"project":"ITU","itemType":"toys","amount":1,"timestamp":{"seconds":{"low":1551102037,"high":0,"unsigned":false},"nanos":512532845},"validity":true}},{"TxId":"7b678194c1ac43ef2519e818f6c8bae292f7a6e10178d3b1e8e9a30c626c3918","Timestamp":{"seconds":{"low":1551102781,"high":0,"unsigned":false},"nanos":25354489},"IsDelete":"false","Value":{"project":"ITU","itemType":"grains","amount":1,"timestamp":{"seconds":{"low":1551102781,"high":0,"unsigned":false},"nanos":25354489},"validity":true}},{"TxId":"965615284efe78c9df5994909548b6d3f72326b875a815278017c57fd74c0739","Timestamp":{"seconds":{"low":1551102798,"high":0,"unsigned":false},"nanos":411077463},"IsDelete":"true","Value":""}]
```

## Calling setter functions within the chaincode

Setter functions require endorsement according to the endorsement policy set during chaincode instantiation, in our case it requires at least one endorsement from each Org individually.

The Setter functions are as follows:

### addDonation

addDonation function represents creation of a donation. Storing the required project, item type and amount params along with validity and timestamp (transaction time stamp), against a unique transaction ID produced by Fabric.

```sh
CREATE1='{"Args":["addDonation", "ITU", "toys", "1"]}'

peer chaincode invoke -o orderer.addtech.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/addtech.com/orderers/orderer.addtech.com/msp/tlscacerts/tlsca.addtech.com-cert.pem -C addtechchannel -n donation-manager-chaincode --peerAddresses peer0.orgone.addtech.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgone.addtech.com/peers/peer0.orgone.addtech.com/tls/ca.crt --peerAddresses peer0.orgtwo.addtech.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgtwo.addtech.com/peers/peer0.orgtwo.addtech.com/tls/ca.crt -c "$CREATE1"

// expected output format
2019-02-25 14:01:26.237 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200 payload:"{\"donationId\":\"684a1b9eb44ce9925af5227be06ecf458b8fa34e7b4c374d7f766c5a50426aaf\"}" 
```

### updateDonation

updateDonation function representing update of a given donation ID. The first argument passed should be a donation ID, following the keys to be updated (could be: project, itemType and amount) and the new updated values. This will recalculate the validity and timestamp for the donation.

```sh
peer chaincode invoke -o orderer.addtech.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/addtech.com/orderers/orderer.addtech.com/msp/tlscacerts/tlsca.addtech.com-cert.pem -C addtechchannel -n donation-manager-chaincode --peerAddresses peer0.orgone.addtech.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgone.addtech.com/peers/peer0.orgone.addtech.com/tls/ca.crt --peerAddresses peer0.orgtwo.addtech.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgtwo.addtech.com/peers/peer0.orgtwo.addtech.com/tls/ca.crt -c '{"Args":["updateDonation", "684a1b9eb44ce9925af5227be06ecf458b8fa34e7b4c374d7f766c5a50426aaf", "itemType", "grains"]}'

// expected output format
2019-02-25 14:05:06.112 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200 payload:"{\"donationId\":\"684a1b9eb44ce9925af5227be06ecf458b8fa34e7b4c374d7f766c5a50426aaf\",\"updateTx\":\"845effc052dbbcf0be8cfe300a908e1285fdbe11c17c36ccc5985456ee949e4c\"}" 
```

### removeDonation

Deletes a donation entity for a given ID from state.

```sh

peer chaincode invoke -o orderer.addtech.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/addtech.com/orderers/orderer.addtech.com/msp/tlscacerts/tlsca.addtech.com-cert.pem -C addtechchannel -n donation-manager-chaincode --peerAddresses peer0.orgone.addtech.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgone.addtech.com/peers/peer0.orgone.addtech.com/tls/ca.crt --peerAddresses peer0.orgtwo.addtech.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgtwo.addtech.com/peers/peer0.orgtwo.addtech.com/tls/ca.crt -c '{"Args":["removeDonation", "684a1b9eb44ce9925af5227be06ecf458b8fa34e7b4c374d7f766c5a50426aaf"]}'

// expected output format
2019-02-25 14:08:05.430 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200 payload:"{\"donationId\":\"684a1b9eb44ce9925af5227be06ecf458b8fa34e7b4c374d7f766c5a50426aaf\",\"deleteTx\":\"4b765927153f1bc9cd51b0166020a6ffe0384255a71776d94c168ea8543c2692\"}" 
```

## Debugging:

To see debugging logs related to chaincode use:

```sh
docker logs -f dev-peer0.orgone.addtech.com-donation-manager-chaincode-1.0

OR

docker logs -f dev-peer0.orgtwo.addtech.com-donation-manager-chaincode-1.0
```

## Running tests

To run tests you need to go where the related chaincode is kept. And install all the required dependencies first. Make sure you are using node `v8.14.0`. To do this, run the following in you terminal:

```sh
cd path/to/project
cd chaincode/donation_manager_chaincode/node

npm install

npm test

//Expected result ends like:
62 passing (146ms)
```

## Creating JSDOC

To create a JSDOC you need to have `jsdoc` package installed in your system. I recommend installing it globally using the following command:

```sh
npm install -g jsdoc
```

Once you have jsdoc you can create a documentation for donationManager chaincode by running the following command (Make sure you are present within node directory of this project):

```sh
jsdoc ./src/donationManager.js
```

You should be able to open it in chrome (if you are using linux), by running the following command:

```sh
google-chrome ./out/index.html 
```

Then you can browse and know more about the functions explained above using it.

## Future scope

This test task was done in a limited frame of time, so I suggest some changes to make it better;

- **Changing unique identifiers used to store donations:** We have used transaction IDs to store donation objects, it would be better if we can use some other unique identifier to do this. It would also allow us to add validations to check that no one can create a donation object for an already existing ID. Also while updating a donation object, we update validity and timestamp, but the donation ID is not updated with the new transaction ID of update. It will also reduce confusion, as we seprate the two different functionalities.

- **Using range queries:**-  If identifiers used to store donation objects are incremental in nature. We will be able to create range queries. 

- **Using composite keys:** We can create composite keys within the chaincode and using them create functions to query donations with same project, item type or amount.

- **Improve test cases:** If I had more time I can improve the quality of test cases.

- **Create an advanced network setup:**-  This test task uses a very basic network setup with 2 orgs having one peer each. We can modify it to make an advanced more stable network.

- **Create an advanced network setup:**-  The network present has configuration ready for couchDB setup, we can make minor tweaks and start using CouchDB instead of LevelDB as state store.

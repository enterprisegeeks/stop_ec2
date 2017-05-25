const  AWS = require('aws-sdk');
const  zlib = require('zlib');

AWS.config.region= 'ap-northeast-1';
// Create an S3 client
let ec2 = new AWS.EC2()

/** EC2インスタンスを停止する -promise版。*/
function stopEC2(instanceIds) {

    console.log("termites ids:" + instanceIds);
    if (instanceIds.length === 0) {
        return new Promise((resole, reject)=>resolve("no instance."));
    }

    let  params = {
        InstanceIds: instanceIds
    };
    ec2.terminateInstances(params).promise()
}

// zlibログ展開。 promise戻し//
function extractLog(event) {
    return new Promise((resolve, reject)=>{
        let log = event.awslogs.data;
        let data = new Buffer(log, "base64");
        zlib.gunzip(data, (e, res) => {
            if (e) {
                reject(e);
            } else {
                resolve(JSON.parse(res.toString('utf-8')));
            }
        });
    });
}

// in lambda
exports.handler = function(event, context, callback) {
    let instanceId ="";
    extractLog(event)
    .then(json =>{
        let ids = [];
        json.logEvents.forEach(e => {
            let m =  JSON.parse(e.message);
            let id =  m.responseElements.instancesSet.items[0].instanceId;
            ids.push(id);
        });
        console.log(ids);
        stopEC2(ids);
    }).then(data => {
        console.log(data);
        callback(null, "stop instance success");
    })
    .catch(e => {
        callback("stop instance error");
    })
};

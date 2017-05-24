const  AWS = require('aws-sdk');
AWS.config.region= 'ap-northeast-1';
// Create an S3 client
let ec2 = new AWS.EC2()

/** EC2インスタンスを停止する */
function stopEC2(instanceIds, callback) {
    if (instanceIds.length == 0) {
        console.log("no running instances");
        return;
    }
    console.log("termites id:" + instanceIds);
    let  params = {
        InstanceIds: instanceIds
    };
    ec2.terminateInstances(params, (err, data)=> {
        if (!!err) {
            console.log(err, err.stack);
        } else {
            console.log(data);
        }
        if (callback) {
            callback();
        }
    });
}

/** 起動中のEC2インスタンスを探し、インスタンスIDを取得します。
 * インスタンスIDを取得して、何をしたいかはcallbackに指定します。
 */
function findRunningEc2(callback) {

    // 停止したいインスタンスID
    // 検索条件
    let filter = {
    DryRun: false,
    Filters: [
        {Name: 'instance-state-name',
         Values: [
            'running','stopping','stopped','pending','shutting-down'
        ]}]
    };
    
    ec2.describeInstances(filter, (err, data)=>{
        
        let instanceIds = [];
        if(err) {
            console.log(err);
        } else {
            console.log(data);

            if(data.Reservations) {
                data.Reservations.forEach((res) => {
                    res.Instances.forEach((obj)=> instanceIds.push(obj.InstanceId));
                });
            }   
        }
        
        callback(instanceIds);
    })
}

// in local
//findRunningEc2(stopEC2);

// in lambda
exports.handler = function(event, context) {
    findRunningEc2(ids => stopEC2(ids, () =>context.done(null, "stop instance")));
};
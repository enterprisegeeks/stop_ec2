Stop EC2 All instance
-----------------------

## IAM Role Policy

This script use `ec2:DescribeInstances`
It needs to all arn resources.
Please see http://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/iam-policies-ec2-console.html 

please try following policy.

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "ec2:*"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
}
```
/**
* Script to idenfity missing boundaries in the chunk collections.
* Script will print all such missing entries with current_boundary and new_boundary value.
* Missing entry can be corrected using below command:
* db.chunks.update({max:current_boundary},{$set:{max:new_boundary}});
*
* @author: Dhiren Sangani
*/

var configDb = db.getSiblingDB("config");
var configArr = configDb.chunks.find({"ns" : "dbName.collName"}).sort({"_id":1}).toArray()

var configDataFailed = [];
for(var i=0;i<configArr.length-2;i++) {
	var maxvalueJSON1 = configArr[i].max;
	if(maxvalueJSON1 != undefined && maxvalueJSON1 != '') {
		
		/**
		* This example uses composite shard key with 3 fields
		**/
		var shardIdField1 = maxvalueJSON1["shardIdField1"];
		var shardIdField2 = maxvalueJSON1["shardIdField2"];
		var shardIdField3 = maxvalueJSON1["shardIdField3"];
            
		var minvalueJSON2 = configArr[i+1].min;
		if(minvalueJSON2 != undefined && minvalueJSON2 != '') {
			var shardIdField11 = minvalueJSON2["shardIdField1"];
			var shardIdField22 = minvalueJSON2["shardIdField2"];
			var shardIdField33 = minvalueJSON2["shardIdField3"];
		
			if( shardIdField1 != shardIdField11 ||
					shardIdField2 != shardIdField22 ||
						shardIdField3 != shardIdField33) {
				var doc = new Object();
				doc._id = configArr[i]._id;
				doc.current_boundary = maxvalueJSON1;
				doc.new_boundary = minvalueJSON2;
				
				configDataFailed.push(doc);
			}
		}
	}
}

if (configDataFailed.length > 0) {
	print("Mismatch found : True")
	print("########## Mismatched Entries ##########")
	printjson(configDataFailed)
	print("########################################")
} else {
	print("Mismatch found : False")
}
function getNode(Data,percentage){
	

var data=JSON.parse(JSON.stringify(Data));
processData(data,percentage);
	
//console.log(Data);

  var nodes = partition.nodes(data);
  var links = partition.links(nodes);


  var max=-100;
  for(var i=0;i<nodes.length;i++){
  	if(nodes[i].depth>max){
  		max=nodes[i].depth;
  	}
  }
  var node=[];
  var j=0;
  for(var i=0;i<nodes.length;i++){
    if(nodes[i].depth==max){
      node[j]=nodes[i];
      j++;
    }
  }
  
  
  
    function processData(root,percentage){
		if(root.dis>percentage*100){
			if(root.children!=null){
				for(var i=0;i<root.children.length;i++){
					processData(root.children[i],percentage);
				}
			}else
				return;
		}else{
			root.children=null;
			return;
		}
	}
    return node;
}

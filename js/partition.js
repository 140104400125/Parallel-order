function drawPartition(Data,cars,startWidth,axisnum,percentage,x,treeData){
	var g5=svg.append("g")
          .attr("transform", "translate(" + startWidth + "," + 380 + ")");
//console.log('percentage: %s', percentage);

//console.log(Data);
var data=JSON.parse(JSON.stringify(Data));
processData(data,percentage);
var treedata=[];
for(var i=0;i<treeData.length;i++){
  treedata[i]=JSON.parse(JSON.stringify(treeData[i]));
  processData(treedata[i],percentage);
}
var treeNode=[];
for(var i=0;i<treedata.length;i++){
  treeNode[i]=partition.nodes(treedata[i]);
}
  var nodes = partition.nodes(data);
  var links = partition.links(nodes);

console.log(treeNode[0][0].values);


  //var node=nodes.filter(function(d,i) { return d.dis>percentage*100; })
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
  var max_lv=-1;min_lv=1000;
  var d_chose = dimensions[axisnum];
  for(var i=0;i<nodes.length;i++){
    var sum=0;
    for(var j=0;j<cars.length;j++){
      if(cars[j][d_chose]>=nodes[i].values[0]&&cars[j][d_chose]<=nodes[i].values[1]){
        sum++;
      }
    }
    if(nodes[i].values[1]!=nodes[i].values[0])
      nodes[i].colour=sum/(nodes[i].values[1]-nodes[i].values[0]);
    else
      nodes[i].colour=sum/1;
    if(nodes[i].colour>max_lv)
      max_lv=nodes[i].colour;
    if(nodes[i].colour<min_lv)
      min_lv=nodes[i].colour;
  }
  
  for(var i=0;i<nodes.length;i++){
    if(nodes[i].values[1]==nodes[i].values[0])
      nodes[i].colour=1;
    else
      nodes[i].colour=(nodes[i].colour-min_lv)/(max_lv-min_lv);
  }
var colorA=d3.rgb(255,255,178);
  var colorB=d3.rgb(253,141,60);
  var colorC=d3.rgb(213,51,46);

  var Scale_color1=d3.interpolate(colorA,colorB);
  var Scale_color2=d3.interpolate(colorB,colorC);
  
  var treeScale1 = d3.scale.linear().
                          domain([0,0.5])
                          .range([0,1]);
  var treeScale2 = d3.scale.linear().
                          domain([0.5,1])
                          .range([0,1]);

  var colorA1=d3.rgb(254,235,226);
  var colorB1=d3.rgb(247,104,161);
  var colorC1=d3.rgb(122,1,119);

  var Scale_color11=d3.interpolate(colorA1,colorB1);
  var Scale_color21=d3.interpolate(colorB1,colorC1);
  
  var rects = g5.selectAll("g")
          .data(nodes)
          .enter().append("g");
  rects.append("rect")
    .attr("x", function(d) { return d.x; })  
    .attr("y", function(d) { return d.y; })  
    .attr("width", function(d) { return d.dx; })  
    .attr("height", function(d) { return d.dy; })  
    .style("stroke", "#fff")
    .attr("fill", function(d) {
      if(d.colour>=0.5){
            return Scale_color2(treeScale2(d.colour));
          }
          else{
            return Scale_color1(treeScale1(d.colour));
          }})
    .on("mousedown",function(d){
      //d3.select(this).style("fill","yellow");
        console.log(d.values);
        var actives = dimensions.filter(function(p,i) { 
        if(i==axisnum)
            return true;
        else
            return false;
        }),
      extents = actives.map(function(p,i) { 
          return d.values;
      });
      var y1={};
      for(var j=0;j<7;j++){
        y1[dime[j]] = d3.scale.linear()
        .domain(d3.extent(cars, function(p) { return +p[dime[j]]; }))
        .range([height, 0]);
      }
    var Scale = d3.scale.linear().
                domain(y1[actives].domain())
                .range([290,0]);
    var ypos_top=Scale(extents[0][0]);
    var ypos_buttom=Scale(extents[0][1]);
    console.log(ypos_top+"    "+ypos_buttom);
    var y_num=58;
    var v_width=(y1[actives].domain()[1]-y1[actives].domain()[0])/y_num;
    var rect_pos=[];
    var rect_pos1=new Array();
    for(var i=0;i<y_num;i++){
      rect_pos1[i]=new Array();
    }
    var rect_pos2=new Array();
    for(var i=0;i<7;i++){
      rect_pos2[i]=new Array();
      for(var j=0;j<y_num;j++){
        rect_pos2[i][j]=new Array();
      }
    }
    var start=290;
    for(var i=0;i<y_num;i++){
      start=start-5;
      rect_pos[i]=start;
    }
    var start1=y1[actives].domain()[0];
    for(var i=0;i<y_num;i++){
      rect_pos1[i][0]=start1;
      rect_pos1[i][1]=start1+v_width;
      start1=start1+v_width;
    }

    for(var i=0;i<dimensions.length;i++){
      var start2=y1[dimensions[i]].domain()[0];
      var dime_width=(y1[dimensions[i]].domain()[1]-y1[dimensions[i]].domain()[0])/y_num;
      for(var j=0;j<y_num;j++){
        rect_pos2[i][j][0]=start2;
        rect_pos2[i][j][1]=start2+dime_width;
        start2=start2+dime_width;
      }
    }
    var num=cars.length;
    /*for(var k=0;k<cars.length;k++){
        if(cars[k][actives]>=extents[0][0]&&cars[k][actives]<=extents[0][1]){
          num++;
        }
      }*/
    var probability=[];
    var probability1=new Array();
    for(var i=0;i<7;i++){
      probability1[i]=new Array();
    }
    var flag=[];
    for(var i=0;i<cars.length;i++){
      flag[i]=0;
    }

    for(var i=0;i<y_num;i++){
      var sum=0;
      for(var k=0;k<cars.length;k++){
        if(cars[k][actives]>=rect_pos1[i][0]&&cars[k][actives]<=rect_pos1[i][1]&&
          cars[k][actives]>=extents[0][0]&&cars[k][actives]<=extents[0][1]){
          sum++;
          flag[k]=1;
        }
      }
      if(num!=0)
        probability[i]=sum/num;
      else
        probability[i]=0;
    }

    for(var i=0;i<7;i++){
      for(var j=0;j<y_num;j++){
        var sum1=0;
        for(var k=0;k<cars.length;k++){
          if(flag[k]==1&&rect_pos2[i][j][1]>=cars[k][dimensions[i]]&&rect_pos2[i][j][0]<=cars[k][dimensions[i]]){
            sum1++;
          }
        }
        if(num!=0)
          probability1[i][j]=sum1/num;
        else
          probability1[i][j]=0;
      }
    }
    var treemin=100,treemax=-100;
    for(var i=0;i<7;i++){
      for(var j=0;j<treeNode[i].length;j++){
        var Num=0;
        var Num1=0;
        for(var k=0;k<cars.length;k++){
          if(flag[k]==1&&treeNode[i][j].values[1]>=cars[k][dimensions[i]]&&treeNode[i][j].values[0]<=cars[k][dimensions[i]]){
            Num++;
          }
          if(treeNode[i][j].values[1]>=cars[k][dimensions[i]]&&treeNode[i][j].values[0]<=cars[k][dimensions[i]]){
            Num1++;
          }
        }
        if(num!=0)
          treeNode[i][j].probability=Num/(num+Num1);
        else
          treeNode[i][j].probability=0;
        if(treeNode[i][j].probability>treemax){
          treemax=treeNode[i][j].probability;
        }
        if(treeNode[i][j].probability<treemin){
          treemin=treeNode[i][j].probability;
        }
      }
    }
    var treeScale = d3.scale.linear().
                          domain([treemin,treemax])
                          .range([0,1]);

    var start_node=505;
    for(var i=0;i<treeNode.length;i++){
      var g6=svg.append("g")
          .attr("class","treeNodeColor")
          .attr("transform", "translate(" + start_node + "," + 380 + ")");
      var rects_node = g6.selectAll("g")
          .data(treeNode[i])
          .enter().append("g");
      rects_node.append("rect")
        .attr("x", function(d) { return d.x; })  
        .attr("y", function(d) { return d.y; })  
        .attr("width", function(d) { return d.dx; })  
        .attr("height", function(d) { return d.dy; })  
        .style("stroke", "#fff")
        .attr("fill", function(d){
          if(treeScale(d.probability)>=0.5){
            return Scale_color21(treeScale2(treeScale(d.probability)));
          }
          else{
            return Scale_color11(treeScale1(treeScale(d.probability)));
          }
        });
        start_node=start_node+118;
    }
    //console.log(probability);
    /*for(var i=0;i<y_num;i++){
      g1.append("rect")
      .attr("id","partion-rect")
      .attr("x",x(actives))
      .attr("y",rect_pos[i])
      .attr("width",200*probability[i]+1)
      .attr("height",5)
      .attr("fill","yellow");
    }*/
    for(var i=0;i<7;i++){
      for(var j=0;j<y_num;j++){
        if(probability1[i][j]==0)
          continue;
        g1.append("rect")
          .attr("id","partion-rect")
          .attr("x",x(dimensions[i]))
          .attr("y",rect_pos[j])
          .attr("width",115*probability1[i][j])
          .attr("height",5)
          .attr("stroke","#fff")
          .attr("stroke-width",0.5)
          .attr("fill",d3.rgb(255,107,32));
      }
    }



    foreground.style("display", function(d) {
      return actives.every(function(p, i) {
        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
      }) ? null : "none";
    });

    })
    .on("mouseout",function(d){
      d3.selectAll("#partion-rect").remove();
      d3.selectAll(".treeNodeColor").remove();
      d3.select(this).transition().duration(200)
        .style("fill", function(d) { 
            if(d.colour>=0.5){
            return Scale_color2(treeScale2(d.colour));
          }
          else{
            return Scale_color1(treeScale1(d.colour));
          }});

        var actives = dimensions.filter(function(p,i) { 
      		return false;
      }),
      extents = actives.map(function(p,i) { 
          return y[p].brush.extent();
         });
  foreground.style("display", function(d) {
    return actives.every(function(p, i) {
      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    }) ? null : "none";
  });
    });

var g7=svg.append("g")
          .attr("transform", "translate(" + startWidth + "," + 380 + ")");
    var circles = g7.selectAll("g")
          .data(nodes)
          .enter().append("g");
  circles.append("circle")
    .attr("cx", function(d) { return d.x+d.dx/2; })  
    .attr("cy", function(d) { return d.y+d.dy/2; })
    .attr("r",5/*function(d) { return d.dx/2-5<d.dy/2-5?d.dx/2-5:d.dy/2-5; }*/)  
    .style("stroke", d3.rgb(40,40,40))
    .style("fill",function(d) {
      if(d.colour>=0.5){
            return Scale_color2(treeScale2(d.colour));
          }
          else{
            return Scale_color1(treeScale1(d.colour));
          }});
drawLine(nodes[0]);
function drawLine(nodeLine){
   var g8=svg.append("g")
          .attr("transform", "translate(" + startWidth + "," + 380 + ")");
  if(nodeLine.children!=null){
        for(var i=0;i<nodeLine.children.length;i++){
          var arrow=getArrow(nodeLine.x+nodeLine.dx/2,nodeLine.y+nodeLine.dy/2,nodeLine.children[i].x+nodeLine.children[i].dx/2,nodeLine.children[i].y+nodeLine.children[i].dy/2);
          var line = g8.append("line")
                   .attr("x1",arrow[0])
                   .attr("y1",arrow[1])
                   .attr("x2",arrow[2])
                   .attr("y2",arrow[3])
                   .attr("stroke-width",1)
                   .attr("stroke-dasharray",3)
                   .style("stroke", d3.rgb(40,40,40))
          drawLine(nodeLine.children[i]);
        }
      }else
        return;
}
function getArrow(x1,y1,x2,y2){
        var PI=3.1415926;
        var line_length=Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
        var cosArrow;
        if(line_length==0)
          cosArrow=0;
        else
            cosArrow=(x2-x1)/line_length;
        var angle;
        if(x2-x1>=0&&y2-y1>=0)
            angle=Math.acos(cosArrow);
        else if(x2-x1<=0&&y2-y1>=0)
            angle=Math.acos(cosArrow);
        else if(x2-x1<=0&&y2-y1<=0)
            angle=2*PI-Math.acos(cosArrow);
        else if(x2-x1>=0&&y2-y1<=0)
            angle=2*PI-Math.acos(cosArrow);
        var end_arrow=[];
        console.log(angle);
        end_arrow[0]=x1+(5+2)*Math.cos(angle);
        end_arrow[1]=y1+(5+2)*Math.sin(angle);
        end_arrow[2]=x1+(line_length-5-2)*Math.cos(angle);
        end_arrow[3]=y1+(line_length-5-2)*Math.sin(angle);
        console.log(end_arrow);
        return end_arrow;
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

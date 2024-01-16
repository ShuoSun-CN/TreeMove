// set parent element id of dragged element
//because after drag we should judge whether the UL element of parent element is none 
var dragparent_id="";

//set list_drop for list div
var list_div_drop=function(ev)
{
         //set not trigger browser default event
        ev.preventDefault();
        //set not bubble
        ev.stopPropagation();
        //get drag element id
        var data = ev.dataTransfer.getData("text");
        let childs=document.getElementById(data).childNodes;
        //begin dfs 

        let ul_node=null;
        let a_node=null;


        for(let i=0;i<childs.length;i++)
        {
            let ele=childs[i];

            if(ele.tagName=='UL')
            {
                dfs2list(ele);

                ul_node=ele;
            }
            if(ele.tagName=='A')
            {
                
                a_node=ele;

            }
        }
        //after dfs we should append the origin element to the list div
        if(document.getElementById(data).tagName=='LI')
        {

            if(a_node!=null)
            {

                document.getElementById(data).removeChild(a_node);
            }
             if(ul_node!=null)
             {
                    document.getElementById(data).removeChild(ul_node);
             }

            //remove ondrop event when li element in list div
            document.getElementById(data).ondrop=null;
            document.getElementById('list').appendChild(document.getElementById(data));
        }
        
        
       
}

//deep first search for li element
var dfs2list=function(ele2)
{
    let childs2=ele2.childNodes;

    let l=childs2.length;

    for(let i=0;i<l;i++)
    {
        
        let ele=childs2[0];
        if(ele.tagName=='LI')
        {

            let a_node=null;
            let ul_node=null;
            for(let j=0;j<ele.childNodes.length;j++)
            {

                if(ele.childNodes[j].tagName=='A')
                {
                    a_node=ele.childNodes[j];
                }
                if(ele.childNodes[j].tagName=='UL')
                {
                    dfs2list(ele.childNodes[j]);

                    ul_node=ele.childNodes[j];
                }
            }
            if(a_node!=null)
            {

                ele.removeChild(a_node);
            }
            if(ul_node!=null)
            {
                            ele.removeChild(ul_node);
            }


            ele.ondrop=null;
            document.getElementById('list').appendChild(ele);
        }

    }

}
//set list div ondrop event
document.getElementById("list").ondrop=list_div_drop;



//set drop function for li elements
var drop=function(ev) {
    //set not bubble
    ev.preventDefault();
    //set not trigger browser default event
    ev.stopPropagation();
    

    var data = ev.dataTransfer.getData("text");
    document.getElementById(data).ondrop=drop;

    // if element stay in origin space then break the function
    if(ev.currentTarget.id==data)
    {
        return;
    }
    if(document.getElementById(data).contains(ev.currentTarget))
    {
        return;
    }


    var childNodes=ev.currentTarget.childNodes;
    var foundUl=false;
    for(var i=0;i<childNodes.length;i++)
    {
        var node=childNodes[i];
        if(node.tagName=="UL")
        {
            node.appendChild(document.getElementById(data));
            foundUl=true;
            break;
        }
    }
    let temp_ul;
    //if there is no ul element in dropped element we should create one for it
    if(!foundUl)
    {
        let temp_show=document.createElement("A");
        temp_show.innerText="-";
        temp_show.style.float="left";
        ev.currentTarget.appendChild(temp_show);
        temp_ul=document.createElement("UL");
        temp_ul.appendChild(document.getElementById(data));
        ev.currentTarget.appendChild(temp_ul);
        temp_show.onclick=function(){
            if(temp_show.innerText=='-')
            {
                temp_ul.style.display='none';
                temp_show.innerText='+';
            }
            else{
                temp_ul.style.display='block';
                temp_show.innerText='-';
            }

        }

    }
}

var allowDrop=function (ev) {
    ev.preventDefault();
}
document.getElementById("list").ondragover=allowDrop;

//set drag element
var drag=function (ev) {
    ev.stopPropagation();
    //record its parent element id
    dragparent_id=ev.currentTarget.parentNode.parentNode.id;

    ev.dataTransfer.setData("text", ev.currentTarget.id);
}
//set drag end event to remove the tag "A"
var dragend =function(ev)
{
    let parent1=document.getElementById(dragparent_id);
    let parent_a="";

    if(dragparent_id=='list' || dragparent_id=='')
    {
        return;
    }
    for(let i=0;i<parent1.childNodes.length;i++)
    {
        let child=parent1.childNodes[i];
                if(child.tagName=='A')
        {
            parent_a=child;
        }
        if(child.tagName=="UL")
        {

            if(child.childNodes.length==0)
            {
                parent1.removeChild(child);
                parent1.removeChild(parent_a);
            }
        }
    }
}


var incease_id=1;

var refresh=function(){
    incease_id=1;

document.getElementById("tree").innerHTML="";
document.getElementById("list").innerHTML="";
var student_tree = "";
var student_list = new Object();
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://ext.gaomuxuexi.com:5870/task/nodes', true);
xhr.send();
xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        rp = this.response;

        rp = JSON.parse(rp);
        if(rp.no=="500")
        {
            alert(rp.msg);

        }
        else{
        student_list = rp.list;
        student_tree = rp.tree;
        
        showTree([student_tree],document.getElementById("tree"));
        showList();
        document.getElementById("1li").draggable=false;
        }
        

    }
}
var showList=function()
{
    for (let i = 0; i < student_list.length; i++) {
    let stu = student_list[i];
    let temp_li = document.createElement("LI");
    temp_li.id=incease_id+"li";
    incease_id=incease_id+1;

    temp_li.draggable="true";
    temp_li.ondragstart=drag;
    temp_li.ondragover=allowDrop;
    temp_li.ondragend=dragend;

    let temp_i = document.createElement("I");
    let temp_text=document.createTextNode(stu.N);
    var tagname="tag"+(stu.type-1);

    temp_i.classList.add(tagname);
    
    temp_li.appendChild(temp_i);
    temp_li.appendChild(temp_text);

    document.getElementById("list").appendChild(temp_li);

}
}

var showTree=function(tree,parent)
{
    for (let i = 0; i < tree.length; i++) {
        let temp_li = document.createElement("LI");
        temp_li.id=incease_id+"li";
        if(incease_id!=1)
        {
            
            temp_li.draggable="true";
        temp_li.ondragstart=drag;
        }
        incease_id=incease_id+1;

        temp_li.ondrop=drop;
        temp_li.ondragover=allowDrop;
        temp_li.ondragend=dragend;


        let temp_show= document.createElement("A");
        let temp_kk=document.createElement("I");
        let temp_name=document.createTextNode(tree[i].N);

        let temp_ul=""; 
        if(tree[i].C.length>0)
        {
            temp_show.innerText="-";
            temp_show.style.float="left";
            temp_li.appendChild(temp_show);
            temp_ul=document.createElement("UL");
            showTree(tree[i].C,temp_ul);
        }

         if(tree[i].type==0)
         {
            temp_kk.classList.add("tag_root");
         }
         else{
            var tagname="tag"+(tree[i].type-1);
            temp_kk.classList.add(tagname);
         }
         temp_li.appendChild(temp_kk);
         temp_li.appendChild(temp_name);
         
       
        if(temp_ul!=""){
            temp_li.appendChild(temp_ul);
        }
        
        temp_li.style.listStyle="none";
        parent.appendChild(temp_li); 

        temp_show.onclick=function(){
            if(temp_show.innerText=='-')
            {
                temp_ul.style.display='none';
                temp_show.innerText='+';
            }
            else{
                temp_ul.style.display='block';
                temp_show.innerText='-';
            }

        }

    }
}
}


var submitinfo=function(){
    var back_info={};
    var list_json=[];
    var tree_json={};
    get_list_info_post(list_json);
    tree_json=get_tree_info_post_dfs(document.getElementById("1li"));
    var xhr = new XMLHttpRequest();
   xhr.open('POST', 'http://ext.gaomuxuexi.com:5870/task/nodesCommit', true);
  xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=utf-8");
   xhr.send('list='+JSON.stringify(list_json)+"&tree="+tree_json);
    xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        rp = this.response;
        rp = JSON.parse(rp);
        if(rp.no=="500")
        {
            alert(rp.msg);

        }
        else{
            alert("提交成功！响应信息:"+rp.msg+"  状态码:"+rp.no);
        }
        

    }
}






}

//get list info to post
var get_list_info_post=function(list_json){
     for(let i=0;i<document.getElementById("list").childNodes.length;i++)
    {
        let temp_info={};
        let node=document.getElementById("list").childNodes[i];
        for(let j=0;j<node.childNodes.length;j++)
        {

            if(node.childNodes[j].tagName=='I')
            {
                temp_info['type']=Number(node.childNodes[j].classList[0].slice(-1))+1;
            }
        }
        temp_info['N']=node.innerText;
        list_json.push(temp_info);

    }

}

//get tree info to post by dfs
var get_tree_info_post_dfs=function(node)
{
    let tree_info={};
    tree_info['C']=[];
    for(let i=0;i<node.childNodes.length;i++)
    {
        let c_node=node.childNodes[i];
        if(c_node.tagName=='I')
        {
            if(c_node.classList[0]=='tag_root')
            {
                tree_info['type']=0;
            }
            
            else{
                tree_info['type']=Number(node.childNodes[i].classList[0].slice(-1))+1;
            }
        }
        else if(c_node.tagName=='UL')
        {
            for(let j=0;j<c_node.childNodes.length;j++)
            {
                tree_info['C'].push(JSON.parse(get_tree_info_post_dfs(c_node.childNodes[j])));
            }

        }
        else if(c_node.tagName=='A')
        {

        }
        else{
            tree_info['N']=c_node.nodeValue;
        }

    }

    var  result =JSON.stringify(tree_info);
    return result;
}
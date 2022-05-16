/* xlsx.js (C) 2013-present  SheetJS -- http://sheetjs.com */

const http = require("http"), url = require("url"), path = require("path"), normalize = path.normalize, join = path.join, sep = path.sep, fs = require("fs");
const querystring = require("querystring");
const XLSX = require('xlsx');
const formidable = require('formidable');
const Client = require('ssh2').Client;
var PORT = 80;
var TIMEOUT = 10000;
//var COMMAND = '\
//cat /proc/cpuinfo |grep "physical id"|sort |uniq|wc -l; \
//cat /proc/cpuinfo |grep "processor"|wc -l; \
//cat /proc/cpuinfo|grep name|cut -f2 -d:|uniq; \
//\n\
//';
var COMMAND = '\
export LANG=en_US.UTF-8; \
export LC_CTYPE=en_US.UTF-8; \
export LC_ALL=en_US.UTF-8; \
set +o history;\
gid=`id -g`; \
if [ ! -f "/etc/os-release" ]; then  echo ""; echo ""; else source /etc/os-release; echo $NAME; echo $VERSION_ID; fi; \
cat /proc/cpuinfo |grep "model name" |wc -l |awk \'{printf "%d\\n", $1}\'; \
echo "`cat /proc/meminfo |grep MemTotal |awk \'{printf $2}\'`/1000/1000"| bc; \
df -k | grep -v "tmpfs" | egrep -A 1 "mapper|dev" | awk \'NF>1{print $(NF-3)}\' | awk -v used=0 \'{used+=$1}END{printf "%.2f\\n",used/1024/1024}\'; \
netstat -an |grep LISTEN |grep -v LISTENING |awk \'{print $4}\'| rev |cut -d ":" -f 1 | rev |sort -n |uniq |awk \'{printf "%d,", $1}\'; echo ""; \
hostname; \
if [ ! -f "/etc/redhat-release" ]; then  echo "not centos"; else cat /etc/redhat-release; fi; \
ps -ef |grep java |grep -v grep |wc -l; \
ps -ef |grep java |grep wlserver |grep -v grep |wc -l; \
ps -ef |grep java |grep tomcat |grep -v grep |wc -l; \
ps -ef |grep mysqld |grep -v grep |wc -l; \
ps -ef |grep redis-server |grep -v grep |wc -l; \
ps -ef |grep mongod |grep -v grep |wc -l; \
ps -ef |grep memcached |grep -v grep |wc -l; \
ps -ef |grep nginx |grep -v grep |wc -l; \
which "java" >/dev/null 2>&1; if [ $? -eq 0 ]; then java -version 2>&1 | sed \'1!d\' | sed -e \'s/"//g\' | awk \'{print $3}\'; else echo ""; fi; \
ps -ef |grep java |grep wlserver |wc -l >/dev/null 2>&1; if [ $? -gt 0 ]; then ps -ef |grep java |grep wlserver |awk \'NR==1\'|grep -Eo "wlserver_[0-9]+.[0-9]+*/"; else echo ""; fi; \
id -g; \
if [ $gid == 0 ]; then  LANG=C; fdisk -l | grep "/dev/" |grep "Disk" | awk -F \'[ :,]+\' \'{printf "%.0f\\n",$5/1024/1024/1024}\' | awk -v total=0 \'{total+=$1}END{printf "%.0f\\n",total}\'; else echo "not root";  fi;\
\n\
';
// var www = 'public';
var root = __dirname;// + sep + www;

var extmap = {};

var getHtml = function(tablehtml) {
	var html = [
		'<!DOCTYPE html>',
		'<html>',
		'<head>',
		'<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />',
		'<title>SheetJS NW.js Demo</title>',
		'<style>',
		'#drop{',
		'	border:2px dashed #bbb;',
		'	-moz-border-radius:5px;',
		'	-webkit-border-radius:5px;',
		'	border-radius:5px;',
		'	padding:25px;',
		'	text-align:center;',
		'	font:20pt bold,"Vollkorn";color:#bbb',
		'}',
		'a { text-decoration: none }',
		'table {',
		'  border-collapse: collapse;',
		'}',
		'table, th, td {',
		'  border: 1px solid black;',
		'}',
		'</style>',
		'<script src="/xlsx.full.min.js"></script>',
		'<script src="/jquery.min.js"></script>',
		'<script src="/moment.js"></script>',
		'<script src="/table.js"></script>',
		'</head>',
		'<body>',
		//		'<pre>',
		//		'<div id="drop">在此处拖放电子表格文件以查看工作表数据</div>',
		'<form name="fileform" method="POST" enctype="multipart/form-data" action="/">',
		'<input type="file" name="file" id="file" onchange="fileform.submit();"/>',
		'</form>',
		//		'</pre>',
		'<p>',
		'<input type="submit" value="导出数据！" id="xport" onclick="export_xlsx();">',
		'</p>',
		'<div id="htmlout">',
		tablehtml,
		'</div>',
		'<br />',
		'</body>',
		'</html>',
	].join("\n");
	return html;
};

const exec = function(conn, cmds, _passwd) {
	//console.log('=======================cmds', cmds, _passwd);
	return new Promise(
			function(resolve, reject) {
				conn.shell({rows: 100, cols: 100}, {env: { LANG: 'en_US.UTF-8', LC_CTYPE: 'en_US.UTF-8', LC_ALL: 'en_US.UTF-8'}}, function(err, stream) {
					if (err) {
						console.log('FIRST :: exec error: ' + err);
						conn.end();
						reject(err);
					}
					let body = '';
					stream.on('close', function(code, signal) {
						console.log('=======================close');
						resolve(body);
					}).on('data', function(buffer) {
						let _data = buffer.toString('utf-8');
						let data = _data.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, '');
						process.stdout.write(data);
//						if (data.endsWith('$ ') || data.endsWith('# ') || data.endsWith('Password: ') || data.endsWith('密码：')) {
						if (data.endsWith('$ ') || data.endsWith('$') 
							|| data.endsWith('# ') || data.endsWith('#') 
							|| data.endsWith('Password: ') || data.endsWith('Password:') 
							|| data.endsWith('密码：')) {//
		    				  let cmd = cmds.shift();
		    				  if(cmd !== undefined) {
		    					  try {
									  //console.log(cmd);
		    						  stream.write(cmd);
		    					  } catch (e) {
		    					  }
		    				  } else {
								  if(body != '') {
									body += data;
								  }
								  setTimeout(function(){
									  conn.end();
								  }, 3500);
		    				  }
						} else if (data.endsWith('(current) UNIX password: ')) {//
							//console.log(_passwd);
							console.log('******');
		    				stream.write(_passwd + '\n');
						} else if (data.endsWith('New UNIX password: ')) {//
							let passwd = '-p-+OewMi42UPTL';
							//console.log(passwd);
							console.log('******');
		    				stream.write(passwd + '\n');
						} else if (data.endsWith('Retype new UNIX password: ')) {//
							let passwd = '-p-+OewMi42UPTL';
							//console.log(passwd);
							console.log('******' + '\n');
		    				stream.write(passwd);
						} else {
							if(cmds.length == 0) {
								body += data;
							}
						}
					}).stderr.on('data', function(data) {
						console.log('STDERR: ' + data);
					}).on('end', function() {
						console.log('=======================end');
					});
				});
			}
	);
};

const getRemotInfo = function(hostinfo, callback){
	if(hostinfo.port === undefined) {
		hostinfo.port = 22;
	}
	if(hostinfo.user_name == null || hostinfo.user_pass == null) {
		if(hostinfo.root_name == null || hostinfo.root_pass == null) {
		} else {
			hostinfo.login_name = hostinfo.root_name;
			hostinfo.login_pass = hostinfo.root_pass;
			hostinfo.cmds = [];
		}
	} else {
		if(hostinfo.root_name == null || hostinfo.root_pass == null) {
			hostinfo.login_name = hostinfo.user_name;
			hostinfo.login_pass = hostinfo.user_pass;
			hostinfo.cmds = [];
		} else {
			hostinfo.login_name = hostinfo.user_name;
			hostinfo.login_pass = hostinfo.user_pass;
			hostinfo.cmds = [ "set +o history;su - " + hostinfo.root_name + "\n", hostinfo.root_pass + "\n" ];
		}
	}
	let timeout = setTimeout(function(){
		conn1.end();
		timeout = null;
		callback({i: hostinfo.i, msg: 'timeout'});
	}, TIMEOUT);
	let conn1 = new Client();
	conn1.on('ready', async function() {
		if(timeout == null) {
			return;
		}
		clearTimeout(timeout);
		hostinfo.cmds.push(COMMAND);
		let str = await exec(conn1, hostinfo.cmds, hostinfo.login_pass);
		//console.log('---------------------------------', str, '-----------------------------------------');
		conn1.end();
		let list = str.split('\r\n');
		//for(let li in list) {
		//	console.log(li + ' ' + list[li]);
		//}
		let obj = {i: hostinfo.i};
			let i = 1;
			let j = 0;
			obj.system = list[j+i];
			j++;
			obj.system_version = list[j+i];
			j++;
			obj.cpu = list[j+i];
			j++;
			obj.memory = list[j+i];
			j++;
			obj.disk_use = list[j+i];
			j++;
			obj.port = list[j+i];
			//j++;
			//obj.established = list[j+i];
			j++;
			obj.hostname = list[j+i];
			j++;
			obj.vv = list[j+i];
			j++;
			obj.java_count =  list[j+i];
			j++;
			obj.weblogic_count =  list[j+i];
			j++;
			obj.tomcat_count =  list[j+i];
			j++;
			obj.mysql_count =  list[j+i];
			j++;
			obj.redis_count =  list[j+i];
			j++;
			obj.mongo_count =  list[j+i];
			j++;
			obj.memcache_count =  list[j+i];
			j++;
			obj.nginx_count =  list[j+i];
			j++;
			obj.java_version =  list[j+i];
			j++;
			obj.wlserver_version =  list[j+i];
			j++;
			obj.gid =  list[j+i];
			j++;
			//console.log('1111111111',j+i);
			//console.log('2222222222',list[j+i]);
			//obj.disk = list[j+i];
			//if(obj.disk != '') {
			obj.disk = list[list.length-2];
			//}
		callback(obj);
	})
	.on('keyboard-interactive', (name, instructions, lang, prompts, finish) => {
        console.log('keyboard');
    })
    .on('error', (error) => {
		//console.log('================================error==================================', error);
        if(error.level == 'client-authentication' && error.message == 'All configured authentication methods failed') {
			if(timeout == null) {
				return;
			}
			clearTimeout(timeout);
			callback({i: hostinfo.i, msg: 'authfailed'});
        }
    })
    .connect(	{
		host : hostinfo.ip,
		port : hostinfo.port,
		username : hostinfo.login_name,
		password : hostinfo.login_pass,
	});
};

var http_server = function(req, res) {
	if (req.method !== 'POST') {
		//  var pathname = __dirname + url.parse(req.url).pathname;
		
		var pathname = url.parse(req.url).pathname;
//		if (pathname == '/') {
//			var tables = '';
//			//var wb = XLSX.utils.book_new();
//			//ws['A1'].l = { Target:"http://sheetjs.com", Tooltip:"Find us @ SheetJS.com!" };
//			var ws_name = "SheetJS";
//			var ws_data = [
//				["S", "h", "e", "e", "t", "J", "S"],
//				[1, 2, 3, 4, 5]
//			];
//			var ws = XLSX.utils.aoa_to_sheet(ws_data);
//			ws['A1'].l = { Target: "http://sheetjs.com", Tooltip: "Find us @ SheetJS.com!" };
//			var wb = XLSX.utils.book_new();
//			XLSX.utils.book_append_sheet(wb, ws, ws_name);
//			var table = XLSX.utils.sheet_to_html(ws, { editable: true });
//			var html = getHtml(table);
//			return res.end(html);
//		} else 
		if (pathname == '/getCPUInfo.json') {
			var hostinfo = querystring.parse(req.url.split("?")[1]);
			//console.log('hostinfo', hostinfo);
			getRemotInfo(hostinfo, function(allinfo){
				//console.log('allinfo', allinfo);
				res.writeHead(200, {
					"Content-Type": "text/javascript",
					"Cache-Control": "no-store, no-cache, must-revalidate",
					"Pragma": "no-cache",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Headers": "Content-Type,Content-Length, Authorization, Accept,X-Requested-With",
					"Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
				});
				res.end(JSON.stringify({ code: 200, msg: allinfo }));
				//res.end(JSON.stringify({ code: 200, msg: 'ok' }));
			});
			return;
		}
		var pathfile = normalize(join(root, pathname));
		root = normalize(root + sep);
		// malicious path
		if ((pathfile + sep).substr(0, root.length) !== root) {
			console.error('malicious path "' + pathfile + '"');
			res.writeHead(403);
			res.end('malicious path "' + pathfile + '"\n');
			return;
		}
		if (path.extname(pathfile) == "") {
			if (pathfile.endsWith('\\')) {
				pathfile += "index.html";
			}
		}
		//	path.exists(pathfile, function(exists) {
		//		if (exists) {
		fs.stat(pathfile, function(stat_error, stat) {
			if (!stat_error && stat.isFile()) {
				switch (path.extname(pathfile)) {
					case ".html":
						res.writeHead(200, {
							"Content-Type": "text/html",
							"Cache-Control": "no-store, no-cache, must-revalidate",
							"Pragma": "no-cache"
						});
						break;
					case ".js":
						res.writeHead(200, {
							"Content-Type": "text/javascript",
							"Cache-Control": "no-store, no-cache, must-revalidate",
							"Pragma": "no-cache"
						});
						break;
					case ".json":
						res.writeHead(200, {
							"Content-Type": "application/json",
							"Cache-Control": "no-store, no-cache, must-revalidate",
							"Pragma": "no-cache",
							"Access-Control-Allow-Origin": "*",
							"Access-Control-Allow-Headers": "Content-Type,Content-Length, Authorization, Accept,X-Requested-With",
							"Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
						});
						break;
					case ".css":
						res.writeHead(200, {
							"Content-Type": "text/css",
							"Cache-Control": "no-store, no-cache, must-revalidate",
							"Pragma": "no-cache"
						});
						break;
					case ".gif":
						res.writeHead(200, {
							"Content-Type": "image/gif",
							"Cache-Control": "no-store, no-cache, must-revalidate",
							"Pragma": "no-cache"
						});
						break;
					case ".jpg":
						res.writeHead(200, {
							"Content-Type": "image/jpeg",
							"Cache-Control": "no-store, no-cache, must-revalidate",
							"Pragma": "no-cache"
						});
						break;
					case ".png":
						res.writeHead(200, {
							"Content-Type": "image/png",
							"Cache-Control": "no-store, no-cache, must-revalidate",
							"Pragma": "no-cache"
						});
						break;
					default:
						res.writeHead(200, {
							"Content-Type": "application/octet-stream",
							"Cache-Control": "no-store, no-cache, must-revalidate",
							"Pragma": "no-cache"
						});
				}
				fs.readFile(pathfile, function(err, data) {
					res.end(data);
				});
			} else {
				res.writeHead(404, {
					"Content-Type": "text/html",
					"Cache-Control": "no-store, no-cache, must-revalidate",
					"Pragma": "no-cache"
				});
				res.end("<h1>404 Not Found</h1>");
			}
		});
	} else {
		var form = new formidable.IncomingForm();
		form.parse(req, function(err, fields, files) {
			var f = files[Object.keys(files)[0]];
			var wb = XLSX.readFile(f.path);
			var ext = 'html';//(fields.bookType || "xlsx").toLowerCase();
			//res.setHeader('Content-Disposition', 'attachment; filename="download.' + (extmap[ext] || ext) + '";');
			//var table = XLSX.write(wb, {type:"buffer", bookType:ext});
			var tables = '';
			wb.SheetNames.forEach(function(sheetName) {
				var htmlstr = XLSX.utils.sheet_to_html(wb.Sheets[sheetName], { editable: true });
				tables += htmlstr;
			});
			var html = getHtml(tables);
			res.end(html);
		});
		
	}
};

http.createServer(http_server).listen(PORT, "0.0.0.0");

console.log('Server running at http://127.0.0.1:' + PORT + '/');

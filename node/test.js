const COMMAND = '\
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
console.log(COMMAND);
Before;
let command = `curl -s https://www.abuseipdb.com/whois/sidefx.com -H user-agent: Chrome | grep -E '<li>\w.*</li>' | sed -E 's/<\/?li>//g' | sed -e s/$/.sidefx.com/\ | sort -u`;

after;
let command = `curl -s https://www.abuseipdb.com/whois/${domain} -H "user-agent: Chrome" | grep -E "<li>\\w.*</li>"| sed -E "s/<\\/?li>//g" | sed -e "s/$/.${domain}/" | sort -u > mmm.txt`;

let crt = `curl -sk "https://crt.sh/?q=sidefx.com&output=json" | jq -r ".[].common_name,.[].name_value" | sed "s/*.//g" | sort -u > crt`;

let crt = `curl -sk "https://crt.sh/?q=sidefx.com&output=json" | jq -r ".[].common_name,.[].name_value" | sed "s/*.//g" | sort -u > crt`;

// ALWAYS " instead of '
// ALWAYS ` as whole wrapper
// ALWAYS ESCAPE / (/ -> //)

// main
//'s/<\/?li>//g'
//console.log("s/</\/?li>//g");
//res: s/<//?li>//g

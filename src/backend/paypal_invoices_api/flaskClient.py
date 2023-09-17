from flask import Flask, request
import json
import uuid

from authAPI import *

app = Flask(__name__)


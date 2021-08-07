import json
import os.path
import requests
import re
from bs4 import BeautifulSoup

def get_content(url):
    page = requests.get(url)
    soup = BeautifulSoup(page.content, "html.parser")
    return soup

def open_json_file(output_path):
    if os.path.isfile(output_path):
        with open(output_path, 'r') as file_descriptor:
            data = json.load(file_descriptor)
            return data

    return None

def save_json_file(data, output_path):
    if not os.path.isfile(output_path):
        with open(output_path, 'w') as file_descriptor:
            json.dump(data, file_descriptor)
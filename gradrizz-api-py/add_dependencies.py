import subprocess
import os

def add_dependencies_from_requirements(requirements_file):
    with open(requirements_file, 'r') as req_file:
        lines = req_file.readlines()
    
    for line in lines:
        package = line.strip()
        if package:
            subprocess.run(['poetry', 'add', package])

# Example usage:
add_dependencies_from_requirements('requirements.txt')

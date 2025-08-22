#!/bin/bash
echo "Running Ansible via Docker..."

docker run --rm -it \
  -v $(pwd):/ansible \
  -w /ansible \
  quay.io/ansible/ansible:latest \
  ansible-playbook -i inventory.ini setup_complete_environment.yml

echo "Ansible playbook completed!"

@echo off
echo Running Ansible via Docker...

docker run --rm -it ^
  -v %CD%:/ansible ^
  -w /ansible ^
  quay.io/ansible/ansible:latest ^
  ansible-playbook -i inventory.ini setup_complete_environment.yml

echo.
echo Ansible playbook completed!
pause

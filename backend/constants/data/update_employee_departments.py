import json
import random

print("Starting to update employee department assignments...")

# Read the current employee data
with open('employee.json', 'r') as f:
    employees = json.load(f)

print(f"Found {len(employees)} employees")

# Update all employees to have either department 1 (Computer) or 2 (Electronics)
for i, employee in enumerate(employees):
    old_dept_id = employee.get('departmentId')
    # Randomly assign to Computer (1) or Electronics (2)
    employee['departmentId'] = random.choice([1, 2])
    
    if i < 5:  # Show first 5 updates
        dept_name = "Computer" if employee['departmentId'] == 1 else "Electronics"
        print(f"Employee {employee['empId']} ({employee['firstName']} {employee['lastName']}): {old_dept_id} -> {dept_name} ({employee['departmentId']})")

# Write the updated data back
with open('employee.json', 'w') as f:
    json.dump(employees, f, indent=2)

print(f"Successfully updated {len(employees)} employees with new department assignments")

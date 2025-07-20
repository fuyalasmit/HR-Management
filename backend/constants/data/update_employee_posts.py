import json
import random

print("Starting to update employee post assignments with new Coordinator value...")

# Read the current employee data
with open('employee.json', 'r') as f:
    employees = json.load(f)

print(f"Found {len(employees)} employees")

# Post options including the new Coordinator
posts = [
    'Morning Coordinator',
    'HOD',
    'DHOD',
    'Coordinator'
]

# Update employees with post assignments (some may get the new Coordinator value)
coordinator_assigned = 0
for i, employee in enumerate(employees):
    # For employees who currently have a post, randomly reassign with new options
    if employee.get('post') is not None:
        old_post = employee['post']
        employee['post'] = random.choice(posts)
        if employee['post'] == 'Coordinator':
            coordinator_assigned += 1
        if i < 5:  # Show first 5 updates
            print(f"Employee {employee['empId']} ({employee['firstName']} {employee['lastName']}): {old_post} -> {employee['post']}")
    
    # Also randomly assign Coordinator to some employees who didn't have posts
    elif random.random() < 0.1:  # 10% chance to get Coordinator post
        employee['post'] = 'Coordinator'
        coordinator_assigned += 1
        if i < 10:
            print(f"Employee {employee['empId']} ({employee['firstName']} {employee['lastName']}): None -> Coordinator")

# Write the updated data back
with open('employee.json', 'w') as f:
    json.dump(employees, f, indent=2)

print(f"Successfully updated employees with new post options")
print(f"Total employees assigned as Coordinator: {coordinator_assigned}")

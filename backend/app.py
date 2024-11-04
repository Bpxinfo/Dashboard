import pandas as pd
# import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime
import time
from collections import Counter
import os
import json
import logging
import re

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

##### ONLINE CHAT BOT FILE 
file_roadmap = 'https://bpxai-my.sharepoint.com/personal/sam_wang_bpx_ai/_layouts/15/download.aspx?share=ER_7qkLxV2JBk0wW_M-p_lUBra6wmxtgzDesLr7BXcIUtA'
file_milestones = 'https://bpxai-my.sharepoint.com/personal/sam_wang_bpx_ai/_layouts/15/download.aspx?share=Ea_e-nI3z0tBtl6Q3Iuvz48B_4IpO_qteKH2T9RGd_nCNw'

output_json_file = 'frontend/src/data/main_data.json'
COLUMN_MAPPING = {
    'project_id': ['CCC Project Title', 'CCC Project', 'Project ID'],
    # Add other fields as needed
}


def normalize_headers(df, mapping):
    # Create a dictionary to rename columns based on the mapping
    rename_dict = {}
    for consistent_key, possible_names in mapping.items():
        for name in possible_names:
            if name in df.columns:
                rename_dict[name] = consistent_key
                break
    return df.rename(columns=rename_dict)
#######################################################################
########################################################################
def calculate_scope_bin(percentage_complete):
    if pd.isna(percentage_complete):
        scope_bin = 0
    # Bin calculation based on completion percentage
    if percentage_complete >= 75:
        scope_bin = 4
    elif percentage_complete >= 50:
        scope_bin = 3
    elif percentage_complete >= 25:
        scope_bin = 2
    else:
        scope_bin = 1
    
    # Re-assign based on your criteria
    if scope_bin <= 2:
        return 3
    elif scope_bin == 3:
        return 2
    elif scope_bin == 4:
        return 1
    else:
        return 0

def calculate_schedule_bin(start_date, end_date):
    if pd.isna(start_date) or pd.isna(end_date):
        return 0
    today = datetime.today().date()
    
    if not pd.isna(end_date) and isinstance(end_date, pd.Timestamp):
        end_date = end_date.date()

        # Check if project is overdue or on time
        if today > end_date:
            return 3  # Worst case, project is overdue
        elif (end_date - today).days <= 30:  # Close to due date (within 30 days)
            return 2  # Medium case
        else:
            return 1  # Best case, project on track
    return 1  # Default to best case if no end date available
    # After calculating the schedule bin
    


def calculate_budget_bin(percentage_spent):
    if pd.isna(percentage_spent):
        return 0
    # Assign bins based on % spent
    if percentage_spent > 75:
        return 3  # Worst, most of the budget spent
    elif percentage_spent > 50:
        return 2  # Medium, more than half of the budget spent
    else:
        return 1  # Best, less than half of the budget spent

def calculate_overall_bin(scope_bin, schedule_bin, budget_bin):
    # Collect bins and filter out the ones that are 0 (NA or missing)
    valid_bins = [bin_value for bin_value in [scope_bin, schedule_bin, budget_bin] if bin_value != 0]
    
    if valid_bins:
        overall_score = round(sum(valid_bins) / len(valid_bins), 2)  # Average only non-zero bins
    else:
        overall_score = 0  # Default to 0 if all bins are missing
    
    return overall_score

def main_all_data():
    def formatenum(num):
        if pd.isna(num):
            return 0
        else:
            return f"{int(num):,}"
    
    def format_date(date):
        return date.strftime('%Y-%m-%d') if isinstance(date, pd.Timestamp) else 'None'

# Read the data from each sheet
    df_roadmap = pd.read_excel(file_roadmap, sheet_name='CCC Project Roadmap', header=3, parse_dates=['Start Date', 'End Date'])
    df_risk = pd.read_excel(file_roadmap, sheet_name='Risk')
    df_milestones = pd.read_excel(file_milestones)
    df_issues = pd.read_excel(file_roadmap, sheet_name='Issues')

    #logger.debug("Normalizing headers for roadmap and risk data.")

    df_roadmap = normalize_headers(df_roadmap, COLUMN_MAPPING)
    df_risk = normalize_headers(df_risk, COLUMN_MAPPING)
    df_milestones = normalize_headers(df_milestones, COLUMN_MAPPING)
    df_issues = normalize_headers(df_issues, COLUMN_MAPPING)
    df_roadmap['project_id'] = df_roadmap['project_id'].str.strip().str.lower()
    df_milestones['project_id'] = df_milestones['project_id'].str.strip().str.lower().apply(lambda x: re.sub(r'^\d+-', '', x).strip())
    df_risk['project_id'] = df_risk['project_id'].str.strip().str.lower()
    df_issues['project_id'] = df_issues['project_id'].str.strip().str.lower()
    df_roadmap['Start Date'] = pd.to_datetime(df_roadmap['Start Date'], errors='coerce')
    df_roadmap['End Date'] = pd.to_datetime(df_roadmap['End Date'], errors='coerce')


    project_dict = {}

#process data from roadmap sheet
    for index, row in df_roadmap.iterrows():
        
        project_id = row['project_id']
        percentage_complete = row['%Complete']
        percentage_spent = row['%Spent']
        start_date = row['Start Date']
        end_date = row['End Date']

        if project_id not in project_dict:
            project_dict[project_id] = {}
        #calculating scope, schedule, budget bins
        scope_bin = calculate_scope_bin(percentage_complete)
        schedule_bin = calculate_schedule_bin(start_date, end_date)
        budget_bin = calculate_budget_bin(percentage_spent)

        project_dict[project_id]['Schedule_bin'] = schedule_bin if schedule_bin is not None else 0

        overall_score = calculate_overall_bin(scope_bin, schedule_bin, budget_bin)
        # logger.debug(f"Calculated bins for project {project_id} -> Scope: {scope_bin}, Schedule: {schedule_bin}, Budget: {budget_bin}, Overall: {overall_score}")
        #logger.debug(f"Project {project_id} -> Schedule_bin: {project_dict[project_id]['Schedule_bin']}")

        
        project_dict[project_id] = {
            'WO#': row['WO#']  if not pd.isna(row['WO#']) else 'None', 
            # 'CCC_Project_Title': row['CCC Project Title'] if not pd.isna(row['CCC Project Title']) else 'None',
            'CCC_Project_Name': row['CCC Project Name'] if not pd.isna(row['CCC Project Name']) else 'None',
            'Project_Lead': row['Project Lead'] if not pd.isna(row['Project Lead']) else 'None',
            'Status': row['Status'] if not pd.isna(row['Status']) else 'None',
            'Status_Description': row['Status Description'] if not pd.isna(row['Status Description']) else 'None',
            'CCC_Pillar': row['CCC Pillar'] if not pd.isna(row['CCC Pillar']) else 'None',
            'P_Start_Quarter': row['Start Quarter'] if not pd.isna(row['Start Quarter']) else 'None',
            'P_Start_Date': format_date(start_date),
            'P_End_Quarter': row['End Quarter'] if not pd.isna(row['End Quarter']) else 'None',
            'P_End_Date': format_date(end_date),
            'P_%Complete': percentage_complete if not pd.isna(percentage_complete) else 0,
            'LT_Actual': row['Actual'] if not pd.isna(row['Actual']) else 0,
            'LT_Accrual': row['Accrual'] if not pd.isna(row['Accrual']) else 0,
            'LT_Budget': row['Budget'] if not pd.isna(row['Budget']) else 0,
            '%Spent': percentage_spent,
            '%Remaining': row['%Remaining'] if not pd.isna(row['%Remaining']) else 0,
            'Impact_Addit_Details': row['Impact / Addit Details'] if not pd.isna(row['Impact / Addit Details']) else 'None',
            'Questions': row['Questions'] if not pd.isna(row['Questions']) else 'None',
            #'Scope_bin': scope_bin,
            'Schedule_bin': schedule_bin,
            'Budget_bin': budget_bin,
            'Overall_bin': overall_score,
            'Scope_bin': scope_bin,
            'labelbg': formatenum(row['Budget']),
            'labelacc': formatenum(row['Accrual']),
            'labelcas': formatenum(row['Actual']),
            
        }
        
#Risk from roadmap sheet:
    for index, row in df_risk.iterrows():
        project_id = row['project_id']
        if project_id in project_dict:
            project_dict[project_id].update({
                'Pace': row['Pace'] if not pd.isna(row['Pace']) else 'None',
                'Execution': row['Execution'] if not pd.isna(row['Execution']) else 'None', 
                'Resources': row['Resources'] if not pd.isna(row['Resources']) else 'None'
            })
# Process milestone data from the second sheet (file_milestones)
    for index, row in df_milestones.iterrows():
        project_id = re.sub(r'^\d+-', '', row['project_id']).strip()  # Remove the number and dash prefix
        
        if project_id not in project_dict:
            project_dict[project_id] = {}
        
        if project_id in project_dict:
            if 'Milestones' not in project_dict[project_id]:
                project_dict[project_id]['Milestones'] = []
                project_dict[project_id]['total_milestones'] = 0  # Initialize total milestones count
                project_dict[project_id]['completed_milestones'] = 0  # Initialize completed milestones count

        # Create the milestone dictionary
        milestone = {
            'Milestone_Summary': row['Milestone Summary'] if not pd.isna(row['Milestone Summary']) else 'None',
            'M_Status': row['Status'] if not pd.isna(row['Status']) else 'None',
            'M_Start': format_date(row['Start']),
            'M_End': format_date(row['End']),
            'M_Actual': row['Actual'] if not pd.isna(row['Actual']) else 0,
            'M_Budget': row['Budget'] if not pd.isna(row['Budget']) else 0
        }
        
        # Append milestone to the project
        project_dict[project_id]['Milestones'].append(milestone)
        
        # Increment total milestones count
        project_dict[project_id]['total_milestones'] += 1        
        # Check if the milestone is marked as 'Done' or completed, and increment completed count
        if row['Status'].lower() == 'done':
            project_dict[project_id]['completed_milestones'] += 1

    # After iterating through milestones, calculate percentage completion for each project
    for project_id in project_dict:
        total_milestones = project_dict[project_id].get('total_milestones', 0)
        completed_milestones = project_dict[project_id].get('completed_milestones', 0)
        
        # Calculate percentage of completion
        if total_milestones > 0:
            percentage_complete = (completed_milestones / total_milestones) * 100
        else:
            percentage_complete = 0  # Handle case where there are no milestones
        
        # Add the calculated percentage to the project
        project_dict[project_id]['% complete'] = round(percentage_complete, 2)

    #Process Issues Data
    for index, row in df_issues.iterrows():
        project_id=row['project_id']

        if project_id not in project_dict:
            project_dict[project_id] = {}
            
        project_dict[project_id].update({
            'IssuesCount': row['Count'],
            'Issues': row['Lookup']
        })
    
    with open(output_json_file, 'w') as f:
        json.dump(project_dict, f, indent=4)
    
    logger.info (f"Data exported to {output_json_file}")
    return project_dict

if __name__ == '__main__':
    main_all_data()
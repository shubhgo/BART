
# #Hand manuplation of data
# - File names upadated to <month> <year>.xlsx
# - West Dublin(WD) column and row removed

# <markdowncell>

# # Read XLS files

# <codecell>

from openpyxl import load_workbook
import csv
import json
import os

# <codecell>

months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
years = ['2013','2012','2011','2010','2009','2008','2007','2006']
station_graph = {"WP": ["NC"],
  "NC": ["WP","CN"],
  "CN": ["NC","PH"],
  "PH":["CN","WC"],
  "WC":["LF","PH"],
  "LF":["WC","OR"],
  "OR":["LF","RR"],
  "RR":["OR","MA"],
  "MA":["RR","AS","19"],
  "AS":["MA","BK"],
  "BK":["NB","AS"],
  "NB":["BK","EP"],
  "EP":["NB","EN"],
  "EN":["EP","RM"],
  "RM":["EN"],
  "19":["MA","12"],
  "12":["19","OW","LM"],
  "OW":["12","LM","EM"],
  "EM":["OW","MT"],
  "MT":["EM","PL"],
  "PL":["MT","CC"],
  "CC":["PL","16"],
  "16":["CC","24"],
  "24":["16","GP"],
  "GP":["BP","24"],
  "BP":["GP","DC"],
  "DC":["BP","CM"],
  "CM":["DC","SS"],
  "SS":["CM","SB"],
  "SB":["MB","SS","SO"],
  "MB":["SB"],
  "SO":["SB"],
  "LM":["12","OW","FV"],
  "FV":["LM","CL"],
  "CL":["FV","SL"],
  "SL":["CL","BF"],
  "BF":["SL","HY","CV"],
  "CV":["BF","ED"],
  "ED":["CV"],
  "HY":["BF","SH"],
  "SH":["HY","UC"],
  "UC":["SH","FM"],
  "FM":["UC"]
}

edge_ids = ['12_19', '12_LM', '12_OW', '16_24', '16_CC', '19_MA', '24_GP', 'AS_BK', 'AS_MA', 'BF_CV', 'BF_HY', 'BF_SL', 'BK_NB', 'BP_DC', 'BP_GP', 'CC_PL', 'CL_FV', 'CL_SL', 'CM_DC', 'CM_SS', 'CN_NC', 'CN_PH', 'CV_ED', 'EM_MT', 'EM_OW', 'EN_EP', 'EN_RM', 'EP_NB', 'FM_UC', 'FV_LM', 'HY_SH', 'LF_OR', 'LF_WC', 'LM_OW', 'MA_RR', 'MB_SB', 'MB_SO', 'MT_PL', 'NC_WP', 'OR_RR', 'PH_WC', 'SB_SO', 'SB_SS', 'SH_UC']

edges_mapping = dict()
# structure: {<source_station>: {<edge_name>: <station_name>}}
station_column_in_excel_file = {'RM':'B','EN':'C','EP':'D','NB':'E','BK':'F','AS':'G','MA':'H','19':'I','12':'J','LM':'K','FV':'L','CL':'M','SL':'N','BF':'O','HY':'P','SH':'Q','UC':'R','FM':'S','CN':'T','PH':'U','WC':'V','LF':'W','OR':'X','RR':'Y','OW':'Z','EM':'AA','MT':'AB','PL':'AC','CC':'AD','16':'AE','24':'AF','GP':'AG','BP':'AH','DC':'AI','CM':'AJ','CV':'AK','ED':'AL','NC':'AM','WP':'AN','SS':'AO','SB':'AP','SO':'AQ','MB':'AR'}
station_list = station_column_in_excel_file.keys()

# <codecell>

# len(station_list)

# <codecell>

""" Generate edge mapping """
station_legs_mapping_file = 'station-leg-mapping.csv'
temp_station_index = list()

with open(station_legs_mapping_file, "rb") as csv_file:
    data_reader = csv.reader(csv_file)
    i = 0
    for row in data_reader:
        if i == 0:
            temp_station_index = row[1:]
        else:
            source_st_id = row[0]
            keys = row[1:]
            edges_mapping[source_st_id] = dict(zip(keys, temp_station_index))
        i += 1

# <codecell>

# edges_mapping

# <codecell>

""" returns a tree for a given source node """
def dfs(source_st):
    visited = dict()
    all_children = dict()
    def explore(v):
        visited[v] = True
        all_children[v] = list()
        for u in station_graph[v]:
            if visited.get(u, False) is False:
                all_children[v].append(u)
                children_of_u = explore(u)
                all_children[v].extend(children_of_u)
        return all_children[v]
    explore(source_st)
    return all_children

# <codecell>

# source_st = 'RM'
week_day = True
time_period = 0
# RM data: B3:B45
# Destination stations: A3:A45
# for row in ws.range('A1:C2'):
# ...        for cell in row:
# ...            print cell

# structure for every station:
# {<month year>:{ed_id:<edge id>, weight:<int> }}

#i = 0



# header = ['Source']
# header.extend(edge_ids)

# print header
station_index = list()
all_data = dict()
for source_st in station_list:
    source_dict = dict()
    child_nodes = dfs(source_st)
    for year in years:
        for month in months:
            # print i
            month_year = month+'_'+year
            extension = '.xlsx'
            file_name = 'ridership/'+month+' '+year+extension
            print source_st+':'+file_name
            work_book = load_workbook(filename = file_name)
            sheet_name = 'Weekday OD'
            cursed_months = ["July","August","September","October","November","December"]
            if int(year) < 2009:
                sheet_name = 'Wkdy Adj OD'
                if int(year) == 2008 and month in cursed_months:
                    sheet_name = 'Weekday OD'
            work_sheet = work_book[sheet_name]
            station_index = [str(row[0].value) for row in work_sheet['A3':'A45']]
            # TODO: remove hardcoding for source station
            start_column_id = station_column_in_excel_file[source_st]+'3'
            end_column_id = station_column_in_excel_file[source_st]+'45'
            ridership_data = [row[0].value for row in work_sheet[start_column_id:end_column_id]]
            aggregated_dist = dict()
            # for every station find the aggregate and store it as a new row in a new csv
            for st in station_index:
                children_list = [st]
                children_list.extend(child_nodes[st])
                agg_dist = 0.00
                for child in children_list:
                    child_index = station_index.index(child)
                    agg_dist += float(ridership_data[child_index])
                aggregated_dist[st] = int(agg_dist)
            # aggregated_distance_row = [source_st]
            edge_list = list()
            for edge in edge_ids:
                station_name = edges_mapping[source_st].get(edge,'not-present')
                edge_list.append({'ed_id':edge, 'weight':aggregated_dist.get(station_name,0)})
                # edge_dict[edge] = aggregated_dist.get(station_name,0)
                # aggregated_distance_row.append(aggregated_dist.get(station_name,0))
            source_dict[month_year] = edge_list
            #print aggregated_distance_row
            #i += 1
    all_data[source_st] = source_dict

# <codecell>

# todo: write to file
# json.dumps(all_data)

# <codecell>

# all_data['RM']['January_2013']

# <codecell>

# all_data['RM']

for station in station_list:
    file_name = 'formatted_edge/'+station+'.json'
    with open(file_name, 'w') as outfile:
        json.dump(all_data[station], outfile)


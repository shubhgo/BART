__author__ = 'shubham'

import copy
# copy.deepcopy
week_day = True
time_period = 0

months_numbers = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']




destination_station_index = list()
all_data = dict()
station_column_in_excel_file = {'RM':'B','EN':'C','EP':'D','NB':'E','BK':'F','AS':'G','MA':'H','19':'I','12':'J','LM':'K','FV':'L','CL':'M','SL':'N','BF':'O','HY':'P','SH':'Q','UC':'R','FM':'S','CN':'T','PH':'U','WC':'V','LF':'W','OR':'X','RR':'Y','OW':'Z','EM':'AA','MT':'AB','PL':'AC','CC':'AD','16':'AE','24':'AF','GP':'AG','BP':'AH','DC':'AI','CM':'AJ','CV':'AK','ED':'AL','NC':'AM','WP':'AN','SS':'AO','SB':'AP','SO':'AQ','MB':'AR'}
station_list = station_column_in_excel_file.keys()
# empty destination dict
destination_dict = dict()
for st in station_list:
    destination_dict[st] = list()

# create deep copies
# copy.deepcopy

for year in years:
    for month in months:
        numerical_month_index = months.index(month)
        numerical_month = months_numbers[numerical_month_index]
        numerical_month_year = numerical_month+'/'+year
        month_year = month+'/'+year
        extension = '.xlsx'
        file_name = 'ridership/'+month+' '+year+extension
        work_book = load_workbook(filename = file_name)
        sheet_name = 'Weekday OD'
        cursed_months = ["July", "August", "September", "October", "November", "December"]
        if int(year) < 2009:
            sheet_name = 'Wkdy Adj OD'
            if int(year) == 2008 and month in cursed_months:
                sheet_name = 'Weekday OD'
        work_sheet = work_book[sheet_name]

        destination_station_index = [str(row[0].value) for row in work_sheet['A3':'A45']]
        for source_st in station_list:
            # TODO: remove hardcoding for source station
            start_column_id = station_column_in_excel_file[source_st]+'3'
            end_column_id = station_column_in_excel_file[source_st]+'45'
            ridership_data = [row[0].value for row in work_sheet[start_column_id:end_column_id]]
            source_st_data = all_data.get(source_st, dict())
            if source_st_data:
                print "not empty"
            else:
                source_st_data = copy.deepcopy(destination_dict)
            for j in range(0, 43):
                datum_dict = {'time': numerical_month_year, 'ridership': ridership_data[j]}
                source_st_data[destination_station_index[j]].append(datum_dict)





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
        # source_dict[month_year] = edge_list
        #print aggregated_distance_row
        #i += 1

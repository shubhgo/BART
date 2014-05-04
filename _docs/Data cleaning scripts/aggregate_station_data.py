__author__ = 'shubham'
import csv

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

stations = station_graph.keys()

ridership = "data/ridership_aug_2013.csv"

# with open(ridership, "rb") as csv_file:
#     data_reader = csv.reader(csv_file)
#     i = 0
#     for row in data_reader:
#         if i == 0:
#             # header row
#             # process and get the column number for each station
#         else:
#             source_station = row[0]


visited = dict()
all_children = dict()


def explore(v):
    visited[v] = True
    all_children[v] = list()
    for u in station_graph[v]:
        if visited.get(u, False) is False:
            children_of_u = explore(u)
            all_children[v].extend(children_of_u)
    return all_children[v]





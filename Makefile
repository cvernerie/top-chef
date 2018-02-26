reload-all-indices: delete-all-indices create-all-indices

create-all-indices: create-michelin-index create-lafourchette-index

delete-all-indices: delete-michelin-index delete-lafourchette-index

delete-michelin-index:
	curl -XDELETE localhost:9200/top_chef_michelin_restaurants

delete-lafourchette-index:
	curl -XDELETE localhost:9200/top_chef_lafourchette_restaurants

create-michelin-index:
	curl -XPUT 'localhost:9200/top_chef_michelin_restaurants?pretty' -H 'Content-Type: application/json'

create-lafourchette-index:
	curl -XPUT 'localhost:9200/top_chef_lafourchette_restaurants?pretty' -H 'Content-Type: application/json'

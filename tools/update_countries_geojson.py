import json
import os.path

countries_geojson_path = "../public/assets/geojson/countries.geojson"
countries_output_path = "../public/assets/geojson"
regions_output_path = "../public/assets/regions"
countries_metadata_path = "../public/assets/geoObjects.json"

script_dir = os.path.dirname(__file__)
countries_geojson_path = os.path.join(script_dir, countries_geojson_path)
countries_output_path = os.path.join(script_dir, countries_output_path)
regions_output_path = os.path.join(script_dir, regions_output_path)
countries_metadata_path = os.path.join(script_dir, countries_metadata_path)

def search(list, iso3166a3):
    for i in range(len(list)):
        if list[i]["iso3166a3"] == iso3166a3:
            return list[i]
    return None

with open(countries_geojson_path, "r") as file_descriptor:
    countries_geojson = json.load(file_descriptor)

with open(countries_metadata_path, "r") as file_descriptor:
    countries_metadata = json.load(file_descriptor)

features = []

for country in countries_geojson["features"]:
    isoA3 = country["properties"]["ISO_A3"].lower()
    name = country["properties"]["ADMIN"]

    if isoA3 == "-99":
        
        del country["properties"]["ADMIN"]
        del country["properties"]["ISO_A3"]
        country["properties"]["name"] = name

        continue

    country_metadata = search(countries_metadata, isoA3)

    if not country_metadata:
        continue

    del country["properties"]["ADMIN"]
    del country["properties"]["ISO_A3"]

    iso3166a2 = country_metadata["iso3166a2"]

    country["properties"]["name"] = name
    country["properties"]["iso3166a2"] = iso3166a2
    country["properties"]["iso3166a3"] = isoA3

    features.append(country)

    country_output_path = "{0}/{1}.geojson".format(countries_output_path, iso3166a2)
    region_output_path = "{0}/{1}.json".format(regions_output_path, iso3166a2)

    if not os.path.isfile(country_output_path):
        with open(country_output_path, 'w') as file_descriptor:
            json.dump(country, file_descriptor)

    if not os.path.isfile(region_output_path):
        with open(region_output_path, 'w') as file_descriptor:
            json.dump([], file_descriptor)

#countries_geojson["features"] = features

with open(countries_geojson_path, 'w') as file_descriptor:
    json.dump(countries_geojson, file_descriptor, indent=2)
from utils import open_json_file, get_content, save_json_file
from fuzzywuzzy import fuzz
from get_country_info import get_list_of_countries_and_territories_by_land_borders, \
    get_list_of_countries_and_territories_by_maritime_boundaries, \
    get_list_of_ISO_3166_country_codes, \
    land_borders_output_path, \
    maritime_borders_output_path, \
    iso3166_output_path

land_borders = list(get_list_of_countries_and_territories_by_land_borders())
save_json_file(land_borders, land_borders_output_path)

maritime_boundaries = list(get_list_of_countries_and_territories_by_maritime_boundaries())
save_json_file(maritime_boundaries, maritime_borders_output_path)

iso31666 = list(get_list_of_ISO_3166_country_codes())

save_json_file(iso31666, iso3166_output_path)
result = []
country_dict = open_json_file("country-map.json")

def match_country(iso31666_country_or_territory, country_or_territory):

    variant = country_dict.get(country_or_territory)

    if variant is not None:
        if variant == iso31666_country_or_territory:
            return True

    variant = country_dict.get(iso31666_country_or_territory)

    if variant is not None:
        if variant == country_or_territory:
            return True

    ratio = fuzz.ratio(country_or_territory, iso31666_country_or_territory)

    if ratio >= 95:
        country_dict[country_or_territory] = iso31666_country_or_territory
        return True

    return False

def get_border(borders, iso31666_country_or_territory):
    for border in borders:
        country_or_territory = border["country_or_territory"]
        match = match_country(iso31666_country_or_territory, country_or_territory)
        
        if match:
            return border

    return None

for iso31666_record in iso31666:

    iso31666_country_or_territory = iso31666_record["country_or_territory"]
    iso3166a2 = iso31666_record["iso3166a2"]
    iso3166a3 = iso31666_record["iso3166a3"]
    country_dict[iso31666_country_or_territory] = iso31666_record

    land_border_match = get_border(land_borders, iso31666_country_or_territory)
    maritime_boundary_match = get_border(maritime_boundaries, iso31666_country_or_territory)

    maritimeNeigbours = []
    landNeighbours = []

    if land_border_match is None:
        print("Could not find land borders for {}".format(iso31666_country_or_territory))
    else:
        neigbours = land_border_match["neigbours"]

        for neigbour in neigbours:
            
            neigbour_match = None
            for iso31666_record1 in iso31666:
                iso31666_country_or_territory1 = iso31666_record1["country_or_territory"]
                match = match_country(iso31666_country_or_territory1, neigbour)

                if match:
                    neigbour_match = iso31666_record1
                    break

                iso31666_full_name = iso31666_record1["full_name"]
                match = match_country(iso31666_full_name, neigbour)
                
                if match:
                    neigbour_match = iso31666_record1
                    break

            if neigbour_match is None:
                print("could not find neighbour: {}".format(neigbour))
                land_neighbour_record = {
                    "name": neigbour
                }
            else:     
                country_or_territory = neigbour_match["country_or_territory"]
                neigbour_iso3166a2 = neigbour_match["iso3166a2"]
                neigbour_iso3166a3 = neigbour_match["iso3166a3"]

                land_neighbour_record = {
                    "name": country_or_territory,
                    "iso3166a2": neigbour_iso3166a2,
                    "iso3166a3": neigbour_iso3166a3
                }

            landNeighbours.append(land_neighbour_record)

    if maritime_boundary_match is None:
        print("Could not find maritime borders for {}".format(iso31666_country_or_territory))
    else:
        neigbours = maritime_boundary_match["neigbours"]

        for neigbour in neigbours:

            neigbour_match = None
            for iso31666_record1 in iso31666:
                iso31666_country_or_territory1 = iso31666_record1["country_or_territory"]
                match = match_country(iso31666_country_or_territory1, neigbour)
                
                if match:
                    neigbour_match = iso31666_record1
                    break

                iso31666_full_name = iso31666_record1["full_name"]
                match = match_country(iso31666_full_name, neigbour)
                
                if match:
                    neigbour_match = iso31666_record1
                    break

            if neigbour_match is None:
                print("could not find neighbour: {}".format(neigbour))
                maritime_neighbour_record = {
                    "name": neigbour
                }
            else:     
                country_or_territory = neigbour_match["country_or_territory"]
                neigbour_iso3166a2 = neigbour_match["iso3166a2"]
                neigbour_iso3166a3 = neigbour_match["iso3166a3"]

                maritime_neighbour_record = {
                    "name": country_or_territory,
                    "iso3166a2": neigbour_iso3166a2,
                    "iso3166a3": neigbour_iso3166a3
                }

            maritimeNeigbours.append(maritime_neighbour_record)

    record = {
        "iso3166a2": iso3166a2,
        "iso3166a3": iso3166a3,
        "landNeighboursCount": len(landNeighbours),
        "maritimeNeigboursCount": len(maritimeNeigbours),
        "landNeighbours": landNeighbours,
        "maritimeNeigbours": maritimeNeigbours
    }

    result.append(record)

save_json_file(result, "neighbours.json")
from utils import get_content, open_json_file, get_content, save_json_file
import re
from fuzzywuzzy import fuzz

land_borders_output_path = "land-borders.json"
maritime_borders_output_path = "maritime-borders.json"
iso3166_output_path = "iso3166.json"

def get_list_of_ISO_3166_country_codes():

    cache = open_json_file(iso3166_output_path)

    if cache is not None:
        for record in cache:
            yield record

    url = "https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes"
    soup = get_content(url)

    rows = soup.find_all("tr")

    for row in rows:
        columns = row.find_all("td", recursive=False)
        
        if len(columns) != 8:
            continue

        links = columns[0].find_all("a")
        country_or_territory = links[0].text.strip()
            
        if country_or_territory == "":
            country_or_territory = links[1].text.strip()

        full_name = columns[1].text.strip()
        iso3166a2 = columns[3].text.strip().lower()
        iso3166a3 = columns[4].text.strip().lower()

        yield {
            "country_or_territory": country_or_territory,
            "full_name": full_name,
            "iso3166a2": iso3166a2,
            "iso3166a3": iso3166a3
        }

def get_list_of_countries_and_territories_by_land_borders():

    cache = open_json_file(land_borders_output_path)

    if cache is not None:
        for record in cache:
            yield record

    url = "https://en.wikipedia.org/wiki/List_of_countries_and_territories_by_land_borders"
    soup = get_content(url)

    rows = soup.find_all("tr")

    for row in rows:
        columns = row.find_all("td", recursive=False)
        
        if len(columns) != 6:
            continue

        links = columns[0].find_all("a")
        country_or_territory = links[0].text.strip()
        
        if country_or_territory == "":
            country_or_territory = links[1].text.strip()
        
        land_neigbours_count = columns[4].contents[0].strip()
        land_neigbours_count = re.match(r'\s?(\d*)', land_neigbours_count).group(1)

        neigbours = [neigbour.text.strip() for neigbour in columns[5].find_all("a")]
        neigbours = [neigbour for neigbour in neigbours if "[" not in neigbour and neigbour != ""]

        yield {
            "country_or_territory": country_or_territory,
            "land_neigbours_count": land_neigbours_count,
            "neigbours": neigbours
        }

def get_list_of_countries_and_territories_by_maritime_boundaries():

    cache = open_json_file(maritime_borders_output_path)

    if cache is not None:
        for record in cache:
            yield record
            
    url = "https://en.wikipedia.org/wiki/List_of_countries_and_territories_by_maritime_boundaries"
    soup = get_content(url)

    rows = soup.find_all("tr")

    for row in rows:
        columns = row.find_all("td", recursive=False)
        
        if len(columns) != 5:
            continue

        links = columns[0].find_all("a")
        country_or_territory = links[0].text.strip()
        
        if country_or_territory == "":
            country_or_territory = links[1].text.strip()

        maritime_boundaries_count = int(columns[1].contents[0].strip())
        maritime_neigbours_count = int(columns[2].contents[0].strip())

        neigbours = [neigbour.text.strip() for neigbour in columns[4].find_all("a")]
        neigbours = [neigbour for neigbour in neigbours if "[" not in neigbour and neigbour != ""]

        yield {
            "country_or_territory": country_or_territory,
            "neigbours": neigbours,
            "maritime_boundaries_count": maritime_boundaries_count,
            "maritime_neigbours_count": maritime_neigbours_count
        }
import requests as rq
import urllib.parse

###################################
###                             ###
###            To do            ###
### Implement a cached requests ###
###                             ###
###################################

class NoLocationFoundError(Exception) :
    """ Base class for no location found error. """
    pass


class GEOCodingService :

    def __init__(self, **kwargs):
        self.lang   = kwargs.get('lang', 'fr')
        self.count  = kwargs.get('count', 10)
        self.format = kwargs.get('format', 'json')
        
    def localize(self, loc):
        # Build API query url
        location = urllib.parse.quote_plus(loc)
        url = f"https://geocoding-api.open-meteo.com/v1/search?name={location}&count={self.count}&language={self.lang}&format={self.format}"

        # get the associated data
        res = rq.get(url)
        # raise exception if code != 200
        res.raise_for_status()

        results = res.json().get('results', [])
        
        # Raise exception if no results found
        if len(results) == 0 : raise NoLocationFoundError(f"No location have been found for `{loc}`.")
        return {
            'city'      : results[0].get('city'),
            'latitude'  : results[0].get('latitude'), 
            'longitude' : results[0].get('longitude')
        }
    
if __name__ == '__main__':
    geo = GEOCodingService()
    try :
        coordinates = geo.localize('Paris')
    except NoLocationFoundError as e:
        print(e)
    else :
        print(coordinates)

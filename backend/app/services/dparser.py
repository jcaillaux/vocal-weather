import pythonmonkey as pm

class DateError(Exception) :
    """ Base class for invalid date parsing error """
    pass

class DATEParserService:

    def __init__(self, lang='fr'):
        dateparser = pm.require('./sugarjs/sugar-adapter')
        self.dateparser = dateparser
        self.lang = lang

    def extract_date(self, date):

        parsed_date = self.dateparser(date, self.lang)
        if parsed_date == 'Invalid Date':
            raise DateError(f"{date} is not a valid date.")
        return parsed_date.split('T')[0]
    

if __name__ == '__main__':
    date_parser = DateParser()

    date = 'lundi prochain à 14:00'

    try :
        parsed_date = date_parser.extract_date(date)
    except DateError as e:
        print(e)
    else : 
        print(parsed_date)

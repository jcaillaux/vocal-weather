from google import genai
from datetime import datetime
import json

#client = genai.Client(api_key="AIzaSyDSfPKkxrx8uOMrVYzk0_-9j-yzAGtqV9Y")


#response = client.models.generate_content(
#    model="gemini-2.0-flash", contents=prompt
#)


#print(response.text)


class NERService:
    def __init__(self):
        self.client = genai.Client(api_key="AIzaSyDSfPKkxrx8uOMrVYzk0_-9j-yzAGtqV9Y")
        
    
    def extract(self, text):
        prompt = f"""
            Tu es un assistant spécialisé dans l'extraction d'informations de texte. Ta tâche est d'identifier précisément :

            1. La localisation mentionnée
            2. La date de début de la période
            3. La date de fin de la période

            Règles :
            - La date du jour est : {datetime.now().strftime("%Y-%m-%d")}
            - Si aucune date n'est explicitement mentionnée, utilise la date du jour comme date de début
            - Si seule une durée est mentionnée (ex: "pour la semaine prochaine"), calcule les dates en conséquence
            - Retourne le résultat au format JSON avec ces clés :

            {{
                "location": "",
                "start_date": "",
                "end_date": ""
            }}
            Traite le texte suivant :
            {text}
        """
        entities = self.client.models.generate_content(
            model='gemini-2.0-flash', contents=prompt
        )
        entities = entities.text.replace('```json', '')
        entities = entities.replace('```', '')
        return json.loads(entities)

if __name__ == '__main__':
    query = "Météo à Tours jusqu'à dimanche inclus"#"Quel temps fera-t-il à Tours lundi prochain vers 14h00 ?"
    ner_service = NERService()
    print(ner_service.extract(query))


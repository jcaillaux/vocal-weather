from gliner import GLiNER

models = {
    'sm_2.5' : 'gliner-community/gliner_medium-v2.5',
    'md_2.1' : 'urchade/gliner_mediumv2.1'
}

class NERService:
    def __init__(self, model = models['md_2.1']):
        self.model = GLiNER.from_pretrained(model, local_files_only=True)
        self.labels = ["Date", "Location", "Time"]
    
    def extract(self, text):
        entities = self.model.predict_entities(text.title(), self.labels, threshold=0.3)
        
        information = dict(zip(self.labels, [ [] for _ in range(len(self.labels)) ]))

        for ent in entities:
            information[ent['label']].append(ent['text'])
        return information


if __name__ == '__main__':
    query = "Quel temps fera-t-il à Tours lundi prochain vers 14h00 ?"
    ner_service = NERService(models['md_2.1'])
    print(ner_service.extract(query))
    

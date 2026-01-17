import { ClassifyDocumentCommand, ComprehendClient, DetectEntitiesCommand, DetectKeyPhrasesCommand } from "@aws-sdk/client-comprehend";
import { DetectLabelsCommand, DetectTextCommand, RekognitionClient } from "@aws-sdk/client-rekognition";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AiService {
  private rekognitionClient: RekognitionClient;
  private s3Client: S3Client;
  private comprehendClient: ComprehendClient; 

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.rekognitionClient = new RekognitionClient({
      region: this.configService.get('AWS_REGION'),
    });
    
    this.s3Client = new S3Client({
      region: this.configService.get('S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('S3_SECRET_ACCESS_KEY'),
      },
    });
    
    this.comprehendClient = new ComprehendClient({
      region: this.configService.get('AWS_REGION'),
    });
  }

  async getImageBytes(s3Key: string) {
    const obj = await this.s3Client.send(new GetObjectCommand({ 
      Bucket: this.configService.get('S3_BUCKET_NAME')!, 
      Key: s3Key, 
    }));

    return obj.Body!.transformToByteArray();
  }

  async analyzeWithRekognition(imageBytes: Uint8Array) {
    const [labelsResp, textResp] = await Promise.all([this.rekognitionClient.send(new DetectLabelsCommand({ Image: { Bytes: imageBytes }, MaxLabels: 15, MinConfidence: 70, })), this.rekognitionClient.send(new DetectTextCommand({ Image: { Bytes: imageBytes }, })),]);
    const labels = (labelsResp.Labels ?? []).map(l => ({ name: l.Name!, confidence: l.Confidence ?? 0 }));
    const texts = (textResp.TextDetections ?? []).filter(t => t.Type === 'LINE').map(t => t.DetectedText!);

    return { labels, texts };
  }

  async analyzeTextWithComprehend(text: string) { const [keyResp, entResp] = await Promise.all([ this.comprehendClient.send(new DetectKeyPhrasesCommand({ Text: text, LanguageCode: 'es' })), this.comprehendClient.send(new DetectEntitiesCommand({ Text: text, LanguageCode: 'es' })), ]);
    const keyPhrases = (keyResp.KeyPhrases ?? []).map(k => k.Text!);
    const entities = (entResp.Entities ?? []).map(e => e.Text!);
    return { keyPhrases, entities };
  } 
 
  async classifyWithComprehend(text: string) { 
    const resp = await this.comprehendClient.send(new ClassifyDocumentCommand({ 
      Text: text, 
      EndpointArn: process.env.COMPREHEND_ENDPOINT_ARN!
    }));
    return (resp.Classes ?? []).sort((a, b) => (b.Score ?? 0) - (a.Score ?? 0)); 
  }

  async analyzeText(text: string) { 
    const [entitiesResp, keyResp] = await Promise.all([ this.comprehendClient.send(new DetectEntitiesCommand({ Text: text, LanguageCode: 'es', })), this.comprehendClient.send(new DetectKeyPhrasesCommand({ Text: text, LanguageCode: 'es', })), ]);
    const entities = entitiesResp.Entities?.map(e => e.Text) ?? []; 
    const keyPhrases = keyResp.KeyPhrases?.map(k => k.Text) ?? []; 
    return { entities, keyPhrases };
  }

  async suggestFromImage(s3Key: string) { 
    const bytes = await this.getImageBytes(s3Key);
    const { labels, texts } = await this.analyzeWithRekognition(bytes);
    const combinedText = [ ...labels.map(l => l.name), ...texts, ].join(' ').toLowerCase();

    const { keyPhrases, entities } = await this.analyzeTextWithComprehend(combinedText);

    const classes = await this.classifyWithComprehend(combinedText);
    const category = classes[0]?.Name ?? 'Sin categoría';
    const features = Array.from(new Set([ ...keyPhrases, ...entities, ...labels.map(l => l.name), ])).slice(0, 10);
    const nameCandidates = this.buildNameCandidates(entities, features);
    const name = nameCandidates[0] ?? 'Producto sugerido';

    return { name, category, features, labels, texts, confidence: classes[0]?.Score ?? 0 }; 
  } 
  
  private buildNameCandidates(entities: string[], features: string[]) { 
    const tokens = Array.from(new Set([...entities, ...features])) .filter(t => /[a-zA-Záéíóúñ0-9]/.test(t)).map(t => this.capitalize(t)) .slice(0, 4);
    const patterns = [ `${tokens[0] ?? 'Producto'} ${tokens[1] ?? ''}`.trim(), `${tokens[0] ?? 'Producto'} ${tokens[1] ?? ''} ${tokens[2] ?? ''}`.trim(), `${tokens[0] ?? 'Producto'} ${tokens[2] ?? ''}`.trim(), ];
  return patterns; 
}

  private capitalize(s: string) { 
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  async analyzeImage(imageBytes: Uint8Array) { 
    const [labelsResp, textResp] = await Promise.all([ 
      this.rekognitionClient.send(new DetectLabelsCommand({ Image: { Bytes: imageBytes }, MaxLabels: 10, MinConfidence: 70, })),
      this.rekognitionClient.send(new DetectTextCommand({ Image: { Bytes: imageBytes }, })),
    ]);

    const labels = labelsResp.Labels?.map(l => l.Name) ?? [];
    const texts = textResp.TextDetections?.map(t => t.DetectedText!) ?? []; 
    
    return { labels, texts };
    }

  async suggestProductInfo(s3Key: string) { 
    const bytes = await this.getImageBytes(s3Key);
    const { labels, texts } = await this.analyzeImage(bytes); 
    const combinedText = [...labels, ...texts].join(" "); 
    const { entities, keyPhrases } = await this.analyzeText(combinedText); // Construir sugerencias simples 
    const name = entities[0] ?? labels[0] ?? "Producto deportivo"; 
    const category = labels.includes("Shoe") || labels.includes("Sneaker") ? "Calzado" : labels.includes("Shirt") || labels.includes("T-shirt") ? "Playeras" : "Accesorios"; 
    const features = Array.from(new Set([...labels, ...texts, ...keyPhrases])); 

    return { name, category, features };
  }
}
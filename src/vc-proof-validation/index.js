import { Ed25519Signature2018 } from '@digitalbazaar/ed25519-signature-2018';
import { Ed25519VerificationKey2018 } from '@digitalbazaar/ed25519-verification-key-2018';
import jsonld from 'jsonld';
import jsigs from 'jsonld-signatures';

// Load JSON-LD documents from URL
async function loadUrlDocument(url) {
  // Get DID document from did:web
  if (url.startsWith('did:web:')) {
    const httpsUrl = `https://${url.replace('did:web:', '').replace(/:/g, '/')}/did.json`;
    return jsonld.documentLoaders.node()(httpsUrl);
  }

  return jsonld.documentLoaders.node()(url);
}

// The signed credential (with proof)
const signedCredential = {
  id: 'urn:dpp:recichain-base-dpp-0-0-6:b2a4e5a1-8fbb-45bd-a1a6-737cdcb843d5',
  type: ['VerifiableCredential', 'DPP'],
  proof: {
    jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..YFWLJu8U9p2PI1gT8dVqoy342BYuLkxe9WkAbaDFZTD3JEK1efdb45AFhsCnbPn1ewqBUhkekKWQSQCEmOdkDQ',
    type: 'Ed25519Signature2018',
    created: '2024-08-21T15:58:32Z',
    proofPurpose: 'assertionMethod',
    verificationMethod:
      'did:web:api-vera.susi.spherity.dev:did-registry:material-recovery-facility-86-b-3-ab-5-b-05-bf-38-cf#a2aed594445d5080150768799423dedb8c0acd84327d6756919f6618e09f385b',
  },
  issuer:
    'did:web:api-vera.susi.spherity.dev:did-registry:material-recovery-facility-86-b-3-ab-5-b-05-bf-38-cf',
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://api-vera.susi.spherity.dev/templates/v1/recichain-base-dpp-0-0-6.jsonld',
  ],
  issuanceDate: '2024-08-21T15:58:32.585Z',
  credentialSubject: {
    id: 'did:web:api-vera.susi.spherity.dev:did-registry:mrf-bale-6-ecffddb-3820-e-3-a-7',
    name: 'MRF Bale',
    idUrl: 'id.recichain.org/01/09520123456788/10/6789/21/12345',
    idValue: '09520123.456788',
    idScheme: 'ref.gs1.org/ai/',
    dimensions: {
      width: {
        value: 0.5,
      },
      height: {
        value: 0.3,
      },
      length: {
        value: 0.87,
      },
      volume: {
        value: 7.5,
      },
      weight: {
        value: 8,
      },
    },
    batchNumber: '6789',
    description: 'Bale of compressed bottles produced at MRF.',
    idSchemeName: 'GS1 SGTIN',
    productImage: {
      linkURL: 'example.com/products/12345/bale.png',
      linkName: 'Recycling instructions',
      linkType: 'gs1:productImage',
      targetType: 'image/png',
    },
    serialNumber: '12345',
    productionDate: '2024-04-25',
    producedByParty: {
      name: 'Material Recovery Facility',
      partyID: 'https://id.recichain.org/ABN/41161080146',
    },
    producedAtFacility: {
      name: 'Material Recovery Facility',
      partyID: 'https://id.recichain.org/ABN/41161080146',
    },
    countryOfProduction: 'CA',
  },
};

// Function to get the public key from the DID document
async function getPublicKeyFromDID(verificationMethod) {
  const didUrl = verificationMethod.split('#')[0];
  const didDocument = await loadUrlDocument(didUrl);
  const publicKey = didDocument.document.verificationMethod.find(
    (method) => method.id === verificationMethod,
  );

  return publicKey;
}

// Function to verify the credential
async function verifyCredential() {
  try {
    // Get the public key from the DID document
    const publicKey = await getPublicKeyFromDID(
      signedCredential.proof.verificationMethod,
    );

    // Create the verification key
    const verificationKey = new Ed25519VerificationKey2018(publicKey);

    // Create the verification suite
    const suite = new Ed25519Signature2018({
      key: verificationKey,
      verificationMethod: publicKey.id,
    });

    const { verified, error } = await jsigs.verify(signedCredential, {
      suite,
      purpose: new jsigs.purposes.AssertionProofPurpose(),
      documentLoader: loadUrlDocument,
    });

    if (verified) {
      console.log('Credential is valid.');
    } else {
      console.error('Credential verification failed:', error);
    }
  } catch (error) {
    console.error('An error occurred during verification:', error);
  }
}

verifyCredential();

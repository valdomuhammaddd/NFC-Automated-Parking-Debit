/**
 * NFC Service Utility
 */

import { Platform } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { NFCTagData } from '../data/types';

class NFCServiceClass {
  private initialized = false;

  async init(): Promise<void> {
    // Skip NFC init on web platform
    if (Platform.OS === 'web') {
      console.log('NFC not available on web platform');
      return;
    }
    
    if (!this.initialized) {
      try {
        await NfcManager.start();
        this.initialized = true;
      } catch (error) {
        console.log('NFC init failed:', error);
        throw new Error('NFC initialization failed');
      }
    }
  }

  async isSupported(): Promise<boolean> {
    // NFC not supported on web
    if (Platform.OS === 'web') {
      return false;
    }
    
    try {
      return await NfcManager.isSupported();
    } catch {
      return false;
    }
  }

  async readTag(): Promise<NFCTagData> {
    // Mock for web platform
    if (Platform.OS === 'web') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { 
        id: `MOCK_NFC_${Date.now()}`, 
        data: 'Mock NFC Data (Web Mode)' 
      };
    }
    
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      
      const tag = await NfcManager.getTag();
      const id = tag?.id || `NFC${Date.now()}`;
      
      let data: string | undefined;
      try {
        const ndefRecords = tag?.ndefMessage;
        if (ndefRecords && ndefRecords.length > 0) {
          const record = ndefRecords[0];
          if (record.payload) {
            const uint8Array = new Uint8Array(record.payload);
            data = Ndef.text.decodePayload(uint8Array);
          }
        }
      } catch (e) {
        console.log('Failed to decode NDEF:', e);
      }

      return { id, data };
    } catch (error) {
      console.log('NFC read error:', error);
      throw error;
    } finally {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    }
  }

  async writeTag(text: string): Promise<void> {
    // Mock for web platform
    if (Platform.OS === 'web') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Mock NFC write (Web Mode):', text);
      return;
    }
    
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      
      const bytes = Ndef.encodeMessage([Ndef.textRecord(text)]);
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
    } catch (error) {
      console.log('NFC write error:', error);
      throw error;
    } finally {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    }
  }

  cancel(): void {
    NfcManager.cancelTechnologyRequest().catch(() => {});
  }
}

const NFCService = new NFCServiceClass();
export default NFCService;

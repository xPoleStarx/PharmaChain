import { DrugLedger } from '@/types/drug';
import { ROLE_ADDRESSES } from '@/lib/constants';
import { UserRole } from '@/types/user';
import { generateTransactionHash } from './utils';
import { LocalStorageAdapter } from '../storage/localStorageAdapter';
import { STORAGE_KEYS } from '@/lib/constants';

export function seedDemoData(): void {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  const twoHours = 2 * oneHour;

  // Drug 1: Aspirin - Registered by Manufacturer (just registered)
  const aspirinId = 'DRUG-ASPIRIN-2024-001';
  const aspirinRegisteredAt = now - twoHours;

  // Drug 2: Vaccine-X - In Transit by Distributor (with temp data)
  const vaccineId = 'DRUG-VACCINE-X-2024-002';
  const vaccineRegisteredAt = now - (oneHour * 3);
  const vaccineTransferredAt = now - (oneHour * 2);

  // Drug 3: Antibiotic - Verified at Pharmacy
  const antibioticId = 'DRUG-ANTIBIOTIC-2024-003';
  const antibioticRegisteredAt = now - (oneHour * 5);
  const antibioticTransferredToDistributor = now - (oneHour * 4);
  const antibioticTransferredToPharmacy = now - (oneHour * 1);

  const ledger: DrugLedger = {
    drugs: {
      [aspirinId]: {
        id: aspirinId,
        name: 'Aspirin 100mg',
        batchNumber: 'BATCH-2024-001',
        currentOwner: ROLE_ADDRESSES[UserRole.MANUFACTURER],
        temperature: 4,
        location: 'Manufacturing Facility',
        registeredAt: aspirinRegisteredAt,
        registeredBy: ROLE_ADDRESSES[UserRole.MANUFACTURER],
      },
      [vaccineId]: {
        id: vaccineId,
        name: 'Vaccine-X',
        batchNumber: 'BATCH-2024-002',
        currentOwner: ROLE_ADDRESSES[UserRole.DISTRIBUTOR],
        temperature: 5.5,
        location: 'In Transit to Pharmacy',
        registeredAt: vaccineRegisteredAt,
        registeredBy: ROLE_ADDRESSES[UserRole.MANUFACTURER],
      },
      [antibioticId]: {
        id: antibioticId,
        name: 'Antibiotic 500mg',
        batchNumber: 'BATCH-2024-003',
        currentOwner: ROLE_ADDRESSES[UserRole.PHARMACY],
        temperature: 6,
        location: 'Pharmacy Storage',
        registeredAt: antibioticRegisteredAt,
        registeredBy: ROLE_ADDRESSES[UserRole.MANUFACTURER],
      },
    },
    transactions: [
      {
        hash: generateTransactionHash(),
        status: 'SUCCESS' as const,
        timestamp: aspirinRegisteredAt,
        from: ROLE_ADDRESSES[UserRole.MANUFACTURER],
        method: 'registerDrug',
        drugId: aspirinId,
      },
      {
        hash: generateTransactionHash(),
        status: 'SUCCESS' as const,
        timestamp: vaccineRegisteredAt,
        from: ROLE_ADDRESSES[UserRole.MANUFACTURER],
        method: 'registerDrug',
        drugId: vaccineId,
      },
      {
        hash: generateTransactionHash(),
        status: 'SUCCESS' as const,
        timestamp: vaccineTransferredAt,
        from: ROLE_ADDRESSES[UserRole.MANUFACTURER],
        to: ROLE_ADDRESSES[UserRole.DISTRIBUTOR],
        method: 'transferDrug',
        drugId: vaccineId,
      },
      {
        hash: generateTransactionHash(),
        status: 'SUCCESS' as const,
        timestamp: vaccineTransferredAt + 10000,
        from: ROLE_ADDRESSES[UserRole.DISTRIBUTOR],
        method: 'updateTemperature',
        drugId: vaccineId,
      },
      {
        hash: generateTransactionHash(),
        status: 'SUCCESS' as const,
        timestamp: vaccineTransferredAt + 20000,
        from: ROLE_ADDRESSES[UserRole.DISTRIBUTOR],
        method: 'updateTemperature',
        drugId: vaccineId,
      },
      {
        hash: generateTransactionHash(),
        status: 'SUCCESS' as const,
        timestamp: antibioticRegisteredAt,
        from: ROLE_ADDRESSES[UserRole.MANUFACTURER],
        method: 'registerDrug',
        drugId: antibioticId,
      },
      {
        hash: generateTransactionHash(),
        status: 'SUCCESS' as const,
        timestamp: antibioticTransferredToDistributor,
        from: ROLE_ADDRESSES[UserRole.MANUFACTURER],
        to: ROLE_ADDRESSES[UserRole.DISTRIBUTOR],
        method: 'transferDrug',
        drugId: antibioticId,
      },
      {
        hash: generateTransactionHash(),
        status: 'SUCCESS' as const,
        timestamp: antibioticTransferredToPharmacy,
        from: ROLE_ADDRESSES[UserRole.DISTRIBUTOR],
        to: ROLE_ADDRESSES[UserRole.PHARMACY],
        method: 'transferDrug',
        drugId: antibioticId,
      },
    ],
    history: {
      [aspirinId]: [
        {
          drugId: aspirinId,
          timestamp: aspirinRegisteredAt,
          eventType: 'REGISTERED',
          transactionHash: generateTransactionHash(),
          toAddress: ROLE_ADDRESSES[UserRole.MANUFACTURER],
          temperature: 4,
          location: 'Manufacturing Facility',
        },
      ],
      [vaccineId]: [
        {
          drugId: vaccineId,
          timestamp: vaccineRegisteredAt,
          eventType: 'REGISTERED',
          transactionHash: generateTransactionHash(),
          toAddress: ROLE_ADDRESSES[UserRole.MANUFACTURER],
          temperature: 4,
          location: 'Manufacturing Facility',
        },
        {
          drugId: vaccineId,
          timestamp: vaccineTransferredAt,
          eventType: 'TRANSFERRED',
          transactionHash: generateTransactionHash(),
          fromAddress: ROLE_ADDRESSES[UserRole.MANUFACTURER],
          toAddress: ROLE_ADDRESSES[UserRole.DISTRIBUTOR],
        },
        {
          drugId: vaccineId,
          timestamp: vaccineTransferredAt + 10000,
          eventType: 'TEMPERATURE_UPDATED',
          transactionHash: generateTransactionHash(),
          temperature: 5.2,
        },
        {
          drugId: vaccineId,
          timestamp: vaccineTransferredAt + 20000,
          eventType: 'TEMPERATURE_UPDATED',
          transactionHash: generateTransactionHash(),
          temperature: 5.5,
        },
      ],
      [antibioticId]: [
        {
          drugId: antibioticId,
          timestamp: antibioticRegisteredAt,
          eventType: 'REGISTERED',
          transactionHash: generateTransactionHash(),
          toAddress: ROLE_ADDRESSES[UserRole.MANUFACTURER],
          temperature: 4,
          location: 'Manufacturing Facility',
        },
        {
          drugId: antibioticId,
          timestamp: antibioticTransferredToDistributor,
          eventType: 'TRANSFERRED',
          transactionHash: generateTransactionHash(),
          fromAddress: ROLE_ADDRESSES[UserRole.MANUFACTURER],
          toAddress: ROLE_ADDRESSES[UserRole.DISTRIBUTOR],
        },
        {
          drugId: antibioticId,
          timestamp: antibioticTransferredToPharmacy,
          eventType: 'TRANSFERRED',
          transactionHash: generateTransactionHash(),
          fromAddress: ROLE_ADDRESSES[UserRole.DISTRIBUTOR],
          toAddress: ROLE_ADDRESSES[UserRole.PHARMACY],
        },
      ],
    },
  };

  LocalStorageAdapter.set(STORAGE_KEYS.LEDGER, ledger);
}

export function resetSystem(): void {
  LocalStorageAdapter.remove(STORAGE_KEYS.LEDGER);
  LocalStorageAdapter.remove(STORAGE_KEYS.CURRENT_USER);
}


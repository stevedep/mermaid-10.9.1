import { log } from '../../logger.js';
import { getConfig as commonGetConfig } from '../../diagram-api/diagramAPI.js';
import { sanitizeText } from '../common/common.js';
import {
  setAccTitle,
  getAccTitle,
  setDiagramTitle,
  getDiagramTitle,
  getAccDescription,
  setAccDescription,
  clear as commonClear,
} from '../common/commonDb.js';
import type { PieFields, PieDB, Sections } from './pieTypes.js';
import type { RequiredDeep } from 'type-fest';
import type { PieDiagramConfig } from '../../config.type.js';
import DEFAULT_CONFIG from '../../defaultConfig.js';

export const DEFAULT_PIE_CONFIG: Required<PieDiagramConfig> = DEFAULT_CONFIG.pie;

export const DEFAULT_PIE_DB: RequiredDeep<PieFields> = {
  sections: {},
  showData: false,
  config: DEFAULT_PIE_CONFIG,
} as const;

let sections: Sections = DEFAULT_PIE_DB.sections;
let showData: boolean = DEFAULT_PIE_DB.showData;
const config: Required<PieDiagramConfig> = structuredClone(DEFAULT_PIE_CONFIG);

const getConfig = (): Required<PieDiagramConfig> => structuredClone(config);

const clear = (): void => {
  sections = structuredClone(DEFAULT_PIE_DB.sections);
  showData = DEFAULT_PIE_DB.showData;
  commonClear();
};

const addSection = (label: string, value: number): void => {
  label = sanitizeText(label, commonGetConfig());
  if (sections[label] === undefined) {
    sections[label] = value;
    log.debug(`added new section: ${label}, with value: ${value}`);
  }
};

const getSections = (): Sections => sections;

const cleanupValue = (value: string): number => {
  if (value.substring(0, 1) === ':') {
    value = value.substring(1).trim();
  }
  return Number(value.trim());
};

const setShowData = (toggle: boolean): void => {
  showData = toggle;
};

const getShowData = (): boolean => showData;

export const db: PieDB = {
  getConfig,

  clear,
  setDiagramTitle,
  getDiagramTitle,
  setAccTitle,
  getAccTitle,
  setAccDescription,
  getAccDescription,

  addSection,
  getSections,
  cleanupValue,
  setShowData,
  getShowData,
};

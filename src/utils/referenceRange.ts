/**
 * @module referenceRange
 * @description Strict Reference-Range Classification Engine for MedLens.
 *
 * CRITICAL RULE: Classifications are based ONLY on reference ranges
 * explicitly stated in source documents. This module NEVER invents,
 * defaults, or substitutes external medical reference ranges.
 *
 * If a reference range is absent from the source report, the result
 * is ALWAYS classified as UNDETERMINED with the explanation
 * "Cannot determine from source".
 */
import type { LabStatus } from '../types/clinical';

export interface ReferenceRangeResult {
  status: LabStatus;
  statusExplanation: string;
  sourceRangePreserved: string;
}

export function classifyLabResult(
  valueStr: string,
  sourceReferenceRange?: string | null
): ReferenceRangeResult {
  if (
    !sourceReferenceRange ||
    sourceReferenceRange.trim() === '' ||
    sourceReferenceRange.toLowerCase().includes('not provided') ||
    sourceReferenceRange.toLowerCase().includes('none') ||
    sourceReferenceRange.trim() === '-'
  ) {
    return {
      status: 'UNDETERMINED',
      statusExplanation: 'Cannot determine from source',
      sourceRangePreserved: 'Reference range not provided',
    };
  }

  const cleanRangeStr = sourceReferenceRange.trim();
  const numValue = parseNumericValue(valueStr);
  if (numValue === null) {
    return {
      status: 'UNDETERMINED',
      statusExplanation: 'Non-numeric test result; classification requires clinical interpretation',
      sourceRangePreserved: cleanRangeStr,
    };
  }

  const intervalMatch = cleanRangeStr.match(/^([\d,.]+)\s*[-–—]\s*([\d,.]+)$/);
  if (intervalMatch) {
    const min = parseFloat(intervalMatch[1].replace(/,/g, ''));
    const max = parseFloat(intervalMatch[2].replace(/,/g, ''));

    if (!isNaN(min) && !isNaN(max)) {
      if (numValue < min) {
        return {
          status: 'LOW',
          statusExplanation: `Value (${numValue}) is below the report reference range (${min}–${max})`,
          sourceRangePreserved: cleanRangeStr,
        };
      } else if (numValue > max) {
        return {
          status: 'HIGH',
          statusExplanation: `Value (${numValue}) is above the report reference range (${min}–${max})`,
          sourceRangePreserved: cleanRangeStr,
        };
      } else {
        return {
          status: 'NORMAL',
          statusExplanation: `Value (${numValue}) is within the report reference range (${min}–${max})`,
          sourceRangePreserved: cleanRangeStr,
        };
      }
    }
  }

  const upperLimitMatch = cleanRangeStr.match(/^(?:<|<=|less than|up to)\s*([\d,.]+)$/i);
  if (upperLimitMatch) {
    const max = parseFloat(upperLimitMatch[1].replace(/,/g, ''));
    if (!isNaN(max)) {
      if (numValue > max) {
        return {
          status: 'HIGH',
          statusExplanation: `Value (${numValue}) exceeds upper reference limit (${max})`,
          sourceRangePreserved: cleanRangeStr,
        };
      } else {
        return {
          status: 'NORMAL',
          statusExplanation: `Value (${numValue}) is within upper reference limit (${max})`,
          sourceRangePreserved: cleanRangeStr,
        };
      }
    }
  }

  const lowerLimitMatch = cleanRangeStr.match(/^(?:>|>=|greater than|at least)\s*([\d,.]+)$/i);
  if (lowerLimitMatch) {
    const min = parseFloat(lowerLimitMatch[1].replace(/,/g, ''));
    if (!isNaN(min)) {
      if (numValue < min) {
        return {
          status: 'LOW',
          statusExplanation: `Value (${numValue}) is below lower reference limit (${min})`,
          sourceRangePreserved: cleanRangeStr,
        };
      } else {
        return {
          status: 'NORMAL',
          statusExplanation: `Value (${numValue}) is above lower reference limit (${min})`,
          sourceRangePreserved: cleanRangeStr,
        };
      }
    }
  }

  return {
    status: 'UNDETERMINED',
    statusExplanation: 'Complex text reference range preserved as written in source report',
    sourceRangePreserved: cleanRangeStr,
  };
}

export function parseNumericValue(valueStr: string): number | null {
  if (!valueStr) return null;
  const match = valueStr.trim().match(/^[-+]?[\d,]+(?:\.\d+)?/);
  if (!match) return null;
  const num = parseFloat(match[0].replace(/,/g, ''));
  return isNaN(num) ? null : num;
}

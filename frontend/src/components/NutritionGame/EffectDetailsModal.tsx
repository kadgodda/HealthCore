import React from 'react';
import { CannabisEffect } from '../../types/nutrition-game';
import styles from './EffectDetailsModal.module.css';

interface EffectDetailsModalProps {
  effect: CannabisEffect | null;
  isOpen: boolean;
  onClose: () => void;
}

const EffectDetailsModal: React.FC<EffectDetailsModalProps> = ({
  effect,
  isOpen,
  onClose
}) => {
  if (!effect) return null;

  return isOpen ? (
    <div className={styles.modalOverlay} onClick={onClose}>
        <div 
          className={styles.modalContent} 
          onClick={e => e.stopPropagation()}
        >
          <div className={`${styles.effectHeader} ${effect.type === 'boost' ? styles.boost : styles.penalty}`}>
            <span className={styles.effectIcon}>
              {effect.type === 'boost' ? '🚀' : '⚠️'}
            </span>
            <h3 className={styles.effectTitle}>
              {effect.type === 'boost' ? 'Performance Boost' : 'Temporary Penalty'}
            </h3>
            <span className={styles.effectPercentage}>
              {effect.percentage > 0 ? '+' : ''}{effect.percentage}%
            </span>
          </div>

          <div className={styles.effectBody}>
            <p className={styles.effectDescription}>{effect.description}</p>
            
            <div className={styles.effectDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Duration:</span>
                <span className={styles.detailValue}>{effect.duration} minutes</span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Affected Receptors:</span>
                <div className={styles.receptorList}>
                  {effect.targetReceptors.map((receptor, idx) => (
                    <span key={idx} className={styles.receptorTag}>
                      {receptor}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Mission Impact:</span>
                <span className={styles.detailValue}>
                  {effect.type === 'boost' 
                    ? 'Increases mission rewards and speeds up progress'
                    : 'Reduces mission rewards temporarily'
                  }
                </span>
              </div>
            </div>

            <button className={styles.closeButton} onClick={onClose}>
              Got it
            </button>
          </div>
        </div>
      </div>
  ) : null;
};

export default EffectDetailsModal;
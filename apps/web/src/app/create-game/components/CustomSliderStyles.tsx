export const sliderStyles = `
  .slider {
    background: linear-gradient(to right, #1e293b 0%, #ffab91 50%, #ff8e53 100%);
    height: 8px;
    border-radius: 8px;
    outline: none;
    opacity: 0.9;
    transition: all 0.3s ease;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .slider:hover {
    background: linear-gradient(to right, #334155 0%, #ff8e53 50%, #ff7043 100%);
    box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 142, 83, 0.3);
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ffab91, #ff8e53);
    cursor: pointer;
    border: 3px solid #ffffff;
    box-shadow:
      0 4px 12px rgba(255, 171, 145, 0.4),
      0 0 0 1px rgba(255, 171, 145, 0.6);
    transition: all 0.3s ease;
  }

  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow:
      0 6px 20px rgba(255, 171, 145, 0.6),
      0 0 0 2px rgba(255, 171, 145, 0.8);
    background: linear-gradient(135deg, #ff8e53, #ff7043);
  }

  .contest-legs-slider {
    background: linear-gradient(to right, #1e293b 0%, #34d399 50%, #10b981 100%);
    height: 8px;
    border-radius: 8px;
    outline: none;
    opacity: 0.9;
    transition: all 0.3s ease;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .contest-legs-slider:hover {
    background: linear-gradient(to right, #334155 0%, #10b981 50%, #059669 100%);
    box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(16, 185, 129, 0.3);
  }

  .contest-legs-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #10b981, #059669);
    cursor: pointer;
    border: 3px solid #ffffff;
    box-shadow:
      0 4px 12px rgba(16, 185, 129, 0.4),
      0 0 0 1px rgba(16, 185, 129, 0.6);
    transition: all 0.3s ease;
  }

  .contest-legs-slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    background: linear-gradient(135deg, #34d399, #10b981);
    box-shadow:
      0 6px 20px rgba(16, 185, 129, 0.6),
      0 0 0 2px rgba(16, 185, 129, 0.8);
  }
`

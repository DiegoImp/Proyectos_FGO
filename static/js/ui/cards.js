
import { getStaticPath, getCurrentPage } from '../utils/routing.js';
import { capitalizeWords } from '../utils/format.js';

const staticPath = getStaticPath();

// Canvas global para mediciones de texto
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

export function getAscensionLevel(rarity, currentLevel) {
  const caps = {
    5: [50, 60, 70, 80],
    4: [40, 50, 60, 70],
    3: [30, 40, 50, 60],
    2: [25, 35, 45, 55],
    1: [20, 30, 40, 50],
    0: [25, 35, 45, 55]
  };

  const limits = caps[rarity];
  if (!limits) return 0;

  if (currentLevel <= limits[0]) return 0;
  if (currentLevel <= limits[1]) return 1;
  if (currentLevel <= limits[2]) return 2;
  if (currentLevel <= limits[3]) return 3;
  return 4;
}

export function getScrollClass(textWidth, containerWidth) {
  if (textWidth <= containerWidth) return "";

  const overflow = textWidth - containerWidth;
  const overflowPercent = (overflow / containerWidth) * 100;

  if (overflowPercent <= 50) return "scroll_short";
  if (overflowPercent <= 120) return "scroll_medium";
  if (overflowPercent <= 230) return "scroll_long";
  return "scroll_extreme";
}

export function generarHTMLmis_servants(servant) {
  let estrellasHTML = '';
  if (servant.rarity === 0 && servant.type !== 'enemyCollectionDetail') {
    estrellasHTML = '<span class="rarity-0">★</span>';
  } else {
    for (let i = 0; i < servant.rarity; i++) {
      estrellasHTML += '<span>★</span>';
    }
  }

  const skillsJSON = JSON.stringify(servant.skills || []).replace(/"/g, '&quot;');

  let skillsHTML = '';
  (servant.skills || []).slice(0, 3).forEach((skill, index) => {
    skillsHTML += `
              <div class="skill_row">
                <img src="${skill.icon}" alt="${skill.name}" class="skill_icon_preview">
                <div class="skill_name" title="${skill.name}">
                  <span id="input-skill-${index + 1}" class="skill_name_text">
                      ${capitalizeWords(skill.name)}
                  </span>
                </div>
                <p class="skill_level">Nivel: ${servant[`skill_${index + 1}`] || 'N/A'}</p>
              </div>
        `;
  });

  let npTypeDisplay = '';
  if (servant.np.type === '2') {
    npTypeDisplay = 'Buster';
  } else if (servant.np.type === '1') {
    npTypeDisplay = 'Arts';
  } else if (servant.np.type === '3') {
    npTypeDisplay = 'Quick';
  }

  let ascensionLevel = getAscensionLevel(servant.rarity, servant.level);
  const faceUrl = servant.face[ascensionLevel.toString()] || servant.face['1'];

  const bondLevel = servant.bond_level || 0;
  const bondIconNumber = bondLevel > 10 ? 11 : bondLevel;
  const bondIconHTML = `<img src="${staticPath}/static/icons/mis-servants/img_bondsgage_${bondIconNumber}.png" alt="Bond ${bondLevel}" class="bond_level_icon">`;
  const bondMaxLevel = bondLevel > 10 ? 15 : 10;

  return `
    <div class="servant_box_container" data-np-type="${servant.np.type}"
    data-class="${(servant.className || 'unknown').toLowerCase()}" 
         data-rarity="${servant.rarity}" 
         data-name="${(servant.name || '').toLowerCase()}" 
         data-face="${faceUrl}" 
         data-type="${(servant.type || '').toLowerCase()}" 
         data-np="${servant.np}"
         data-servant-id="${servant.id}" 
         data-skills="${skillsJSON}"
         data-level="${servant.level}"
         data-np-level="${servant.np_level || 1}"
         data-bond-level="${servant.bond_level || 0}"
         data-skill-1="${servant.skill_1 || 1}"
         data-skill-2="${servant.skill_2 || 1}"
         data-skill-3="${servant.skill_3 || 1}"
         data-atk="${servant.atk}"
          data-hp="${servant.hp}">
      <div class="servant_box">
      <div class="box_name">
        <span>${servant.name}</span>
        <div class="box_stats">
          <span>ATK: 1200</span>
          <span>HP: 1200</span>
        </div>
      </div>
      <img src="${staticPath}/static/classes/${(servant.className || 'unknown').toLowerCase()}.png" class="box_class_icon">
      <div class="card_rareza">
        <span class="rarity_card">
        ${estrellasHTML}
        </span>
        <span>Nivel: ${servant.level}</span>
      </div>
      <img src="${faceUrl}" alt="Icono de ${servant.name}" class="box_imagen">
      </div>
      <div class="box_details_overlay">
      <div class="box_details_content">
        <div class="skills_details">
        <h3>Active Skills</h3>
        ${skillsHTML}
        </div>
        <div class="INFO_details">
        <h3>Servant Info</h3>
        <div class="NP_info">
          <div class="np_top_row">
          <span class="np_title">NOBLE PHANTASM</span>
          <span class="np_card_type">${npTypeDisplay}</span>
          </div>
          <div class="np_name" title="${servant.np.name}">
            <span class="np_name_text">${servant.np.name}</span>
          </div>
          <div class="np_level_row">
          <span class="np_lvl_label">Nivel:</span>
          <span class="np_lvl_value" id="np-lvl-value">${servant.np_level}</span>
          </div>
        </div>
        <div class="Bond_info">
          <div class="bond_info_details">
          <span class="bond_label">Bond Level:</span>
          ${bondIconHTML}
          <div class="bond_value_wrapper">
            <span class="bond_value" id="bond-value">${servant.bond_level}</span><span class="bond_max" id="bond-max">/${bondMaxLevel}</span>
          </div>
          </div>
        </div>
        </div>
      </div>
      <div class="redirect_buttons">
        <button class="btn_custom btn_calc">
        <i class="fas fa-calculator"></i> Calculadora
        </button>
        <button class="btn_custom btn_detail">
        Más detalles <i class="fas fa-arrow-right text-xs"></i>
        </button>
      </div>
      </div>
    </div>
    `;
}

export function aplicarScrollDinamicoPorColumna() {
  const currentPage = getCurrentPage();
  if (currentPage !== 'mis-servants') return;

  const allCards = document.querySelectorAll('.servant_box_container');
  if (allCards.length === 0) return;

  const skillContainerWidths = [null, null, null];
  const npContainerWidths = [null, null, null];

  const maxMeasure = Math.min(3, allCards.length);
  for (let i = 0; i < maxMeasure; i++) {
    const card = allCards[i];
    const skillContainer = card.querySelector('.skill_name');
    const npContainer = card.querySelector('.np_name');

    if (skillContainer) {
      skillContainerWidths[i] = skillContainer.getBoundingClientRect().width;
    }
    if (npContainer) {
      npContainerWidths[i] = npContainer.getBoundingClientRect().width;
    }
  }

  allCards.forEach((card, index) => {
    const columnIndex = index % 3;
    const skillContainerWidth = skillContainerWidths[columnIndex];
    const npContainerWidth = npContainerWidths[columnIndex];

    if (skillContainerWidth) {
      const skillTexts = card.querySelectorAll('.skill_name_text');
      skillTexts.forEach(skillText => {
        const textWidth = skillText.scrollWidth;
        const scrollClass = getScrollClass(textWidth, skillContainerWidth);
        skillText.classList.remove('scroll_short', 'scroll_medium', 'scroll_long', 'scroll_extreme');
        if (scrollClass) skillText.classList.add(scrollClass);
      });
    }

    if (npContainerWidth) {
      const npText = card.querySelector('.np_name_text');
      if (npText) {
        const textWidth = npText.scrollWidth;
        const scrollClass = getScrollClass(textWidth, npContainerWidth);
        npText.classList.remove('scroll_short', 'scroll_medium', 'scroll_long', 'scroll_extreme');
        if (scrollClass) npText.classList.add(scrollClass);
      }
    }
  });
}

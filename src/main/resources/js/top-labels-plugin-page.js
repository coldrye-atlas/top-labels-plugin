(function (AJS) {

  var THRESHOLD = -0.7;

  var pageMetadataAndLabelsContainer;
  var clonedLabelsSection;
  var mainContent;

  /*
  <a href="#page-metadata-end" class="assistive">Skip to end of metadata</a>
  <div id="page-metadata-start" class="assistive"></div>
  <div class="page-metadata">...</div>
  <a href="#page-metadata-start" class="assistive">Go to start of metadata</a>
  <div id="page-metadata-end" class="assistive"></div>
   */
  function preparePageMetadataAndLabelsContainer() {

    var pageMetadataSection = AJS.$('<div class="page-metadata-section"/>');
    pageMetadataSection.append(AJS.$('a[href="#page-metadata-end"]'));
    pageMetadataSection.append(AJS.$('#page-metadata-start'));
    pageMetadataSection.append(AJS.$('.page-metadata'));
    pageMetadataSection.append(AJS.$('a[href="#page-metadata-start"]'));
    pageMetadataSection.append(AJS.$('#page-metadata-end'));

    pageMetadataAndLabelsContainer = AJS.$('<div class="page-metadata-and-labels-container"/>');
    pageMetadataAndLabelsContainer.append(pageMetadataSection);
    pageMetadataAndLabelsContainer.insertBefore(mainContent);
  }

  function applyTopLabels() {

    if (!pageMetadataAndLabelsContainer) {

      preparePageMetadataAndLabelsContainer();
    }

    var labelsSection = AJS.$('#labels-section');
    clonedLabelsSection = labelsSection.clone();

    // prevent likes plugin from augmenting the cloned labels section
    clonedLabelsSection.attr('id', null);
    clonedLabelsSection.addClass('cloned-labels-section no-print');
    pageMetadataAndLabelsContainer.append(clonedLabelsSection);

    var editLabelsAnchor = AJS.$('#labels-section a.show-labels-editor');
    var clonedEditLabelsAnchor = AJS.$('.cloned-labels-section a.show-labels-editor');
    clonedEditLabelsAnchor.click(function () {

      editLabelsAnchor.click();
    });
  }

  function isApplicable() {

    var mainContentOuterHeight = mainContent.outerHeight(true);
    var innerWindowHeight = window.innerHeight;

    return ((mainContentOuterHeight - innerWindowHeight) / innerWindowHeight) > THRESHOLD;
  }

  function resizeHandler() {

    var applicable = isApplicable();
    if (clonedLabelsSection) {

      applicable ? clonedLabelsSection.show() : clonedLabelsSection.hide();
    }
    else if (!pageMetadataAndLabelsContainer && applicable) {

      applyTopLabels();
    }
  }

  var resizeDebouncer = AJS.debounce(resizeHandler, 300);
  AJS.$(window).resize(resizeDebouncer);

  AJS.$(document).ready(function () {

    mainContent = AJS.$('#main-content');
    if (isApplicable()) {

      applyTopLabels();
    }
  });
}(AJS));

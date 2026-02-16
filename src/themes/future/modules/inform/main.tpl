
<div id="inform" class="card inform" data-page-url="{$PAGE_URL}">
    <div class="card-header filter-select">
        <label class="form-label">{$LANG->getModule('filter_by_criteria')}</label>
        <select class="form-select" name="filter">
            <option value="">{$LANG->getModule('filter_all')}</option>
            {foreach $FILTERS key=key item=item}
            <option value="{$key}">{$item}</option>
            {/foreach}
        </select>
    </div>
    <div class="load_content" id="generate_page"></div>
</div>

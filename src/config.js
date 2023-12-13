module.exports = {
    AREA: {
        ACTION_BAR: 'ActionBar',
        HEADER_MENU: 'HeaderMenu'
    },
    TEMPLATES_MAP: {
        ADD_BUTTONS: {
            ACTION_BAR: [
                {
                    node: 'key.name=actionBar',
                    template: 'stub-action-bar.ejs',
                    dataAdapter: (buttons) => ({
                        actionBar: {
                            action: 'getButtons',
                            buttons
                        }
                    })
                },
                {
                    node: 'key.name=getButtons',
                    template: 'stub-get-buttons.ejs',
                    dataAdapter: (buttons) => ({
                        buttons
                    })
                },
                {
                    node: 'type=ReturnStatement',
                },
                {
                    node: 'type=ArrayExpression',
                    template: 'ejs-buttons.ejs',
                    dataAdapter: (buttons) => ({
                        buttons
                    })
                },
            ],
            HEADER_MENU: {
                ADD_BUTTONS: [
                    {
                        node: 'key.name=headerMenu',
                        template: 'stub-action-bar.ejs'
                    },
                    {
                        node: 'key.name=getButtons',
                        template: 'stub-get-buttons.ejs'
                    },
                    {
                        node: 'type=ReturnStatement',
                        template: null
                    },
                    {
                        node: 'type=ArrayExpression',
                        template: 'ejs-button.ejs'
                    },
                ]
            }
        },
    },
    TEMPLATE_PACKAGE: {
        NAME: "@adobe/aem-cf-admin-ui-ext-tpl"
    }
}

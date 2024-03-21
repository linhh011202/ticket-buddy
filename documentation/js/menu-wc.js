'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ticketbuddy documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-fdec3dd35b482a547649f482ffb2cd55d916bbb9b3d0b1f8f98d1adfab1e80dd444ec00a50217cf87e223321fd077d4307c3035163d9e89c8dd1173856d2cedf"' : 'data-bs-target="#xs-components-links-module-AppModule-fdec3dd35b482a547649f482ffb2cd55d916bbb9b3d0b1f8f98d1adfab1e80dd444ec00a50217cf87e223321fd077d4307c3035163d9e89c8dd1173856d2cedf"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-fdec3dd35b482a547649f482ffb2cd55d916bbb9b3d0b1f8f98d1adfab1e80dd444ec00a50217cf87e223321fd077d4307c3035163d9e89c8dd1173856d2cedf"' :
                                            'id="xs-components-links-module-AppModule-fdec3dd35b482a547649f482ffb2cd55d916bbb9b3d0b1f8f98d1adfab1e80dd444ec00a50217cf87e223321fd077d4307c3035163d9e89c8dd1173856d2cedf"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CalanderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CalanderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ClassificationComponentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClassificationComponentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EventComponentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventComponentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GroupCreateComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GroupCreateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GroupDetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GroupDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GroupListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GroupListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GroupPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GroupPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListEventsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListEventsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavigationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NavigationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PersonalCalenderPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PersonalCalenderPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SearchPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SearchPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WatchlistPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WatchlistPageComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#pipes-links-module-AppModule-fdec3dd35b482a547649f482ffb2cd55d916bbb9b3d0b1f8f98d1adfab1e80dd444ec00a50217cf87e223321fd077d4307c3035163d9e89c8dd1173856d2cedf"' : 'data-bs-target="#xs-pipes-links-module-AppModule-fdec3dd35b482a547649f482ffb2cd55d916bbb9b3d0b1f8f98d1adfab1e80dd444ec00a50217cf87e223321fd077d4307c3035163d9e89c8dd1173856d2cedf"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-AppModule-fdec3dd35b482a547649f482ffb2cd55d916bbb9b3d0b1f8f98d1adfab1e80dd444ec00a50217cf87e223321fd077d4307c3035163d9e89c8dd1173856d2cedf"' :
                                            'id="xs-pipes-links-module-AppModule-fdec3dd35b482a547649f482ffb2cd55d916bbb9b3d0b1f8f98d1adfab1e80dd444ec00a50217cf87e223321fd077d4307c3035163d9e89c8dd1173856d2cedf"' }>
                                            <li class="link">
                                                <a href="pipes/GroupmemberPipePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GroupmemberPipePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/GrouppipePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GrouppipePipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthenticationService.html" data-type="entity-link" >AuthenticationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CalendarService.html" data-type="entity-link" >CalendarService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GroupService.html" data-type="entity-link" >GroupService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationService.html" data-type="entity-link" >NotificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TicketmasterService.html" data-type="entity-link" >TicketmasterService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WatchlistService.html" data-type="entity-link" >WatchlistService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CalanderEvent.html" data-type="entity-link" >CalanderEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CalanderEventColor.html" data-type="entity-link" >CalanderEventColor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ClassificationInterface.html" data-type="entity-link" >ClassificationInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EventInterface.html" data-type="entity-link" >EventInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EventPageInterface.html" data-type="entity-link" >EventPageInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GenreInterface.html" data-type="entity-link" >GenreInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GroupInterface.html" data-type="entity-link" >GroupInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IdClassType.html" data-type="entity-link" >IdClassType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IdName.html" data-type="entity-link" >IdName</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PageInterface.html" data-type="entity-link" >PageInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SegmentInterface.html" data-type="entity-link" >SegmentInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserInterface.html" data-type="entity-link" >UserInterface</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
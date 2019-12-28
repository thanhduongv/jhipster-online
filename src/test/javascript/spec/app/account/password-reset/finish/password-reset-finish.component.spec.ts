/**
 * Copyright 2017-2020 the original author or authors from the JHipster Online project.
 *
 * This file is part of the JHipster Online project, see https://github.com/jhipster/jhipster-online
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ComponentFixture, TestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { Renderer, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { JhonlineTestModule } from '../../../../test.module';
import { PasswordResetFinishComponent } from 'app/account/password-reset/finish/password-reset-finish.component';
import { PasswordResetFinishService } from 'app/account/password-reset/finish/password-reset-finish.service';
import { MockActivatedRoute } from '../../../../helpers/mock-route.service';

describe('Component Tests', () => {
    describe('PasswordResetFinishComponent', () => {
        let fixture: ComponentFixture<PasswordResetFinishComponent>;
        let comp: PasswordResetFinishComponent;

        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                imports: [JhonlineTestModule],
                declarations: [PasswordResetFinishComponent],
                providers: [
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({ key: 'XYZPDQ' })
                    },
                    {
                        provide: Renderer,
                        useValue: {
                            invokeElementMethod(renderElement: any, methodName: string, args?: any[]) {}
                        }
                    },
                    {
                        provide: ElementRef,
                        useValue: new ElementRef(null)
                    }
                ]
            })
                .overrideTemplate(PasswordResetFinishComponent, '')
                .createComponent(PasswordResetFinishComponent);
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(PasswordResetFinishComponent);
            comp = fixture.componentInstance;
            comp.ngOnInit();
        });

        it('should define its initial state', () => {
            comp.ngOnInit();

            expect(comp.keyMissing).toBeFalsy();
            expect(comp.key).toEqual('XYZPDQ');
            expect(comp.resetAccount).toEqual({});
        });

        it(
            'sets focus after the view has been initialized',
            inject([ElementRef], (elementRef: ElementRef) => {
                const element = fixture.nativeElement;
                const node = {
                    focus() {}
                };

                elementRef.nativeElement = element;
                spyOn(element, 'querySelector').and.returnValue(node);
                spyOn(node, 'focus');

                comp.ngAfterViewInit();

                expect(element.querySelector).toHaveBeenCalledWith('#password');
                expect(node.focus).toHaveBeenCalled();
            })
        );

        it('should ensure the two passwords entered match', () => {
            comp.resetAccount.password = 'password';
            comp.confirmPassword = 'non-matching';

            comp.finishReset();

            expect(comp.doNotMatch).toEqual('ERROR');
        });

        it(
            'should update success to OK after resetting password',
            inject(
                [PasswordResetFinishService],
                fakeAsync((service: PasswordResetFinishService) => {
                    spyOn(service, 'save').and.returnValue(of({}));

                    comp.resetAccount.password = 'password';
                    comp.confirmPassword = 'password';

                    comp.finishReset();
                    tick();

                    expect(service.save).toHaveBeenCalledWith({
                        key: 'XYZPDQ',
                        newPassword: 'password'
                    });
                    expect(comp.success).toEqual('OK');
                })
            )
        );

        it(
            'should notify of generic error',
            inject(
                [PasswordResetFinishService],
                fakeAsync((service: PasswordResetFinishService) => {
                    spyOn(service, 'save').and.returnValue(throwError('ERROR'));

                    comp.resetAccount.password = 'password';
                    comp.confirmPassword = 'password';

                    comp.finishReset();
                    tick();

                    expect(service.save).toHaveBeenCalledWith({
                        key: 'XYZPDQ',
                        newPassword: 'password'
                    });
                    expect(comp.success).toBeNull();
                    expect(comp.error).toEqual('ERROR');
                })
            )
        );
    });
});

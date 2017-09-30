/* @internal */
namespace ts.codefix {
    registerCodeFix({
        errorCodes: [Diagnostics.This_value_has_type_0_which_accepts_too_few_arguments_to_be_used_as_a_decorator_here_Did_you_mean_to_call_it_first.code],
        getCodeActions: (context: CodeFixContext) => {
            const sourceFile = context.sourceFile;
            const token = getTokenAtPosition(sourceFile, context.span.start, /*includeJsDocComment*/ false);
            const decorator = getAncestor(token, SyntaxKind.Decorator) as Decorator;
            Debug.assert(!!decorator, "Expected position to be owned by a qualified name.");
            const replacement = createCall(decorator.expression, /*typeArguments*/ undefined, /*argumentsArray*/ undefined);
            const changeTracker = textChanges.ChangeTracker.fromContext(context);
            changeTracker.replaceNode(sourceFile, decorator.expression, replacement);

            return [{
                description: getLocaleSpecificMessage(Diagnostics.Call_decorator_expression),
                changes: changeTracker.getChanges()
            }];
        }
    });
}

import 'package:flutter/material.dart';

// Material 3 Stitch 디바이더 — TSK-004
class StitchDivider extends StatelessWidget {
  const StitchDivider({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        children: List.generate(40, (_) => Expanded(
          child: Container(
            height: 2,
            margin: const EdgeInsets.symmetric(horizontal: 2),
            color: const Color(0xFF8C8C8C),
          ),
        )),
      ),
    );
  }
}
